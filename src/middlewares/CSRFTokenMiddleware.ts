import type {
	HookHandlerDoneFunction,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import type { CSRFTokenService } from '@/services/index.js';

import { UnauthorizedAccessEvent } from '@/events/index.js';
import { InvalidCSRFTokenError } from '@/errors/index.js';

/**
 * CSRF token middleware.
 *
 * When method.from is cookie, will get the "param"
 * value from cookie. E.g: request.cookies[param].
 *
 * When method.from is header, will get the "param"
 * value from header. E.g: request.headers[param].
 *
 * If csrf token is invalid for any reason, it will:
 * - Publish UnauthorizedAccessEvent.
 * - Return InvalidCSRFTokenError.
 *
 * @param {Object} method The method to get the csrf token.
 * @param {string} method.from The source of the csrf token.
 * @param {string} method.param The parameter name to get the csrf token.
 * @param {Object} deps The dependencies.
 * @param {CSRFTokenService} deps.CSRF_SERVICE The csrf token service.
 * @returns Callback function.
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const CSRFTokenMiddleware =
	(
		method: {
			from: 'header' | 'cookie';
			param: string;
		},
		deps: { CSRF_SERVICE: CSRFTokenService },
	) =>
	(
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	) => {
		const { from, param } = method;
		const { CSRF_SERVICE } = deps;

		const token =
			from === 'header'
				? CSRF_SERVICE.verifyHeader(request, param)
				: CSRF_SERVICE.verifyCookie(request, param);

		if (!token) {
			UnauthorizedAccessEvent.publish(request);
			done(new InvalidCSRFTokenError());
			return;
		}

		done();
	};
