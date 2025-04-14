import type { FastifyInstance, RawServerBase } from 'fastify';

import { LoggerService } from '@piggly/ddd-toolkit';

/**
 * Log the response of the request.
 *
 * I will log only on development environment.
 * And if the debug level is enabled for LoggerService.
 *
 * The best way for logging requests/response should be
 * at nGINX or similar.
 *
 * @param {FastifyInstance<Server>} app The Fastify instance.
 * @param {Environment} env The environment.
 * @returns {void}
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const LogResponseHook = <
	Server extends RawServerBase,
	Environment extends Record<string, any>,
>(
	app: FastifyInstance<Server>,
	env: Environment,
): void => {
	if (env && env?.environment !== 'development') {
		return;
	}

	app.addHook('onResponse', async (request, reply) => {
		LoggerService.softResolve().debug('HTTP_RESPONSE', {
			id: request.id,
			duration: reply.elapsedTime,
			hostname: request.hostname,
			method: request.method,
			status: reply.statusCode,
			url: request.url,
		});
	});
};
