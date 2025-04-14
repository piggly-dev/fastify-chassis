import type {
	HookHandlerDoneFunction,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import { UnauthorizedAccessEvent } from '@/events';
import { UnauthorizedError } from '@/errors';
import { getBasicToken } from '@/utils';

/**
 * BasicAuthMiddleware is a middleware that checks if the request
 * is authenticated using Basic Authentication.
 *
 * If request is not authenticated, it will:
 * - Publish UnauthorizedAccessEvent.
 * - Return UnauthorizedError.
 *
 * @param {Object} expected - The expected username and password.
 * @param {string} expected.username - The expected username.
 * @param {string} expected.password - The expected password.
 * @returns The middleware function.
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const BasicAuthMiddleware =
	(expected: { password: string; username: string }) =>
	(
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	) => {
		const auth = getBasicToken(request.headers);

		if (auth === undefined) {
			UnauthorizedAccessEvent.publish(request);
			done(new UnauthorizedError());
			return;
		}

		const { password, username } = auth;

		if (username !== expected.username || password !== expected.password) {
			UnauthorizedAccessEvent.publish(request);
			done(new UnauthorizedError());
			return;
		}

		done();
	};
