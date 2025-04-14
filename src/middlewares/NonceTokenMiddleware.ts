import type {
	HookHandlerDoneFunction,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import type { NonceTokenService } from '@/services';

import { UnauthorizedAccessEvent } from '@/events';
import { InvalidNonceTokenError } from '@/errors';
import { getHeaderValue } from '@/utils';

/**
 * Nonce token middleware.
 *
 * When method.from is body, will get the "param"
 * value from body. E.g: request.body[param].
 *
 * When method.from is header, will get the "param"
 * value from header. E.g: request.headers[param].
 *
 * When regenerate is set to true, then it will append
 * to reply header the "X-Nonce-Token" header with the
 * new nonce token that can be used to verify the request.
 *
 * The ttl is related to the nonce token expiration time
 * when regenerating the nonce token.
 *
 * If nonce token is invalid for any reason, it will:
 * - Publish UnauthorizedAccessEvent.
 * - Return InvalidNonceTokenError.
 *
 * @param {Object} method The method to get the nonce token.
 * @param {string} method.from The source of the nonce token.
 * @param {string} method.param The parameter name to get the nonce token.
 * @param {boolean} [method.regenerate] Whether to regenerate the nonce token.
 * @param {number} [method.ttl] The nonce token expiration time.
 * @param {Object} deps The dependencies.
 * @param {NonceTokenService} deps.NONCE_SERVICE The nonce token service.
 * @returns Callback function.
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const NonceTokenMiddleware =
	(
		method: {
			from: 'header' | 'body';
			param: string;
			regenerate?: boolean;
			ttl?: number;
		},
		deps: { NONCE_SERVICE: NonceTokenService },
	) =>
	(
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	) => {
		const { from, param, regenerate = false, ttl = 3600 } = method;
		const { NONCE_SERVICE } = deps;

		const token =
			from === 'header'
				? getHeaderValue(request, param, '')
				: ((request.body as any)[param] ?? '');

		if (!token) {
			UnauthorizedAccessEvent.publish(request);
			done(new InvalidNonceTokenError());
			return;
		}

		NONCE_SERVICE.verify(token, regenerate, ttl)
			.then(t => {
				if (t === undefined) {
					UnauthorizedAccessEvent.publish(request);
					done(new InvalidNonceTokenError());
					return;
				}

				if (regenerate) {
					reply.header('X-Nonce-Token', t);
				}

				done();
			})
			.catch(() => {
				UnauthorizedAccessEvent.publish(request);
				done(new InvalidNonceTokenError());
				return;
			});
	};
