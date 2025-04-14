import type { FastifyRequest, FastifyReply } from 'fastify';

import type { NonceTokenService } from '@/services';

/**
 * NonceBodyIssuerRoute is a route that issues a nonce as a body.
 *
 * On request body, you can send a number to issue that many nonces.
 * E.g: { size: 3 }, by default it will issue 1 nonce.
 *
 * It will return a 200 status code and nonces as a body.
 * E.g: { tokens: ['nonce1', 'nonce2', 'nonce3'] }
 *
 * @param {Object} deps
 * @param {NonceTokenService} deps.NONCE_SERVICE
 * @param {number} [ttl] The TTL of the nonce.
 * @returns Route handler.
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const NonceBodyIssuerRoute =
	(deps: { NONCE_SERVICE: NonceTokenService }, ttl: number = 3600) =>
	async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
		let { size = 1 } = request.body as any;

		if (typeof size !== 'number') {
			size = parseInt(size, 10);
		}

		if (isNaN(size)) {
			size = 1;
		}

		return reply
			.status(200)
			.send({ tokens: await deps.NONCE_SERVICE.issue(size, ttl) });
	};
