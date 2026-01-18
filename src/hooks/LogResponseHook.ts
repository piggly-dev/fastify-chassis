import { LoggerService } from '@piggly/ddd-toolkit';
import debug from 'debug';

import type { FastifyInstance, RawServerBase } from 'fastify';

/**
 * Log the response of the request.
 *
 * I will log only when debug mode is enabled.
 * LoggerService will handle requests/responses if debug level is enabled as well.
 *
 * The best way for logging requests/response should be at nGINX or similar.
 *
 * @param {FastifyInstance<Server>} app The Fastify instance.
 * @param {Environment} env The environment.
 * @returns {void}
 * @since 7.0.0
 * @since 7.2.1 Added debug mode.
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const LogResponseHook = <
	Server extends RawServerBase,
	Environment extends Record<string, any>,
>(
	app: FastifyInstance<Server>,
	env: Environment,
): void => {
	if (env && env.debug !== true) {
		return;
	}

	app.addHook('onRequest', async request => {
		const data = {
			body: request.body ?? {},
			headers: request.headers ?? {},
			hostname: request.hostname,
			id: request.id,
			method: request.method,
			params: request.params ?? {},
			query: request.query ?? {},
			url: request.url,
		};

		debug('http:server')(`➡️ [${data.method}] "${data.url}"`, {
			body: data.body,
			headers: data.headers,
			id: data.id,
			params: data.params,
			query: data.query,
		});

		LoggerService.softResolve().debug('HTTP_REQUEST', data);
	});

	app.addHook('onSend', async (request, reply, payload) => {
		const data = {
			body: payload ?? {},
			duration: reply.elapsedTime,
			headers: reply.getHeaders(),
			hostname: request.hostname,
			id: request.id,
			method: request.method,
			status: reply.statusCode,
			url: request.url,
		};

		debug('http:server')(`⬅️ [${data.method}/${data.status}] "${data.url}"`, {
			body: data.body,
			duration: data.duration,
			headers: data.headers,
			id: data.id,
		});

		LoggerService.softResolve().debug('HTTP_RESPONSE', data);
	});
};
