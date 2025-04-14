import type { FastifyRequest, FastifyReply } from 'fastify';

import type { CSRFTokenService, CookieOptions } from '@/services';

/**
 * CSRFCookieIssuerRoute is a route that issues a CSRF token as a cookie.
 *
 * It will return a 204 status code and a CSRF token as a cookie.
 *
 * @param {Object} deps
 * @param {CSRFTokenService} deps.CSRF_SERVICE
 * @param {string} [name] The name of the cookie.
 * @param {CookieOptions} [options] The options of the cookie.
 * @returns Route handler.
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const CSRFCookieIssuerRoute =
	(
		deps: { CSRF_SERVICE: CSRFTokenService },
		name: string = 'csrf_token',
		options?: CookieOptions,
	) =>
	async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
		deps.CSRF_SERVICE.asCookie(reply, name, options);
		return reply.status(204).send();
	};
