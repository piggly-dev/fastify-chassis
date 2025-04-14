import type { FastifyRequest, FastifyReply } from 'fastify';

import type { CSRFTokenService } from '@/services';

/**
 * CSRFHeaderIssuerRoute is a route that issues a CSRF token as a header.
 *
 * It will return a 204 status code and a CSRF token as a header.
 *
 * @param {Object} deps
 * @param {CSRFTokenService} deps.CSRF_SERVICE
 * @param {string} [header] The header name.
 * @returns Route handler.
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const CSRFHeaderIssuerRoute =
	(
		deps: { CSRF_SERVICE: CSRFTokenService },
		header: string = 'X-Csrf-Token',
	) =>
	async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
		deps.CSRF_SERVICE.asHeader(reply, header);
		return reply.status(204).send();
	};
