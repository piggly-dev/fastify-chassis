import type { FastifyRequest, FastifyReply } from 'fastify';

import type { HealthCheckService } from '@/services';

/**
 * Health check route.
 *
 * It will run the health check service and return the result.
 * If success, it will return 200. Otherwise, it will return 503.
 *
 * The response will be a JSON object with the following properties:
 * - [service]: boolean
 *
 * @param {Object} deps
 * @param {HealthCheckService} deps.HEALTH_CHECK_SERVICE
 * @returns Route handler.
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const HealthCheckRoute =
	(deps: { HEALTH_CHECK_SERVICE: HealthCheckService }) =>
	async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
		const response = await deps.HEALTH_CHECK_SERVICE.check();
		return reply.status(response.success ? 200 : 503).send(response);
	};
