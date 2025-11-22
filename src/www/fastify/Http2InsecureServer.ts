import { Http2Server as Server } from 'http2';

import fastify, { FastifyHttp2Options } from 'fastify';

import type { ApiDefaultEnvironment, ApiServerOptions } from '@/types/index.js';

import { AbstractServer } from '@/www/fastify/AbstractServer.js';

/**
 * @file The API server.
 * @copyright Piggly Lab 2023
 */
export class Http2InsecureServer<
	AppEnvironment extends ApiDefaultEnvironment,
> extends AbstractServer<Server, AppEnvironment> {
	/**
	 * Create a new API server.
	 *
	 * @param options The options.
	 * @public
	 * @constructor
	 * @memberof ApiServer
	 * @since 1.0.0
	 * @since 7.2.1 Disable fastify logs.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		options: ApiServerOptions<Server, AppEnvironment>,
		fastifyOptions?: FastifyHttp2Options<Server>,
	) {
		super(
			options,
			fastify(
				fastifyOptions || {
					disableRequestLogging: options.env.environment === 'production',
					http2: true,
					/** @note There is no reason to log with fastify. */
					logger: false,
					trustProxy: true,
				},
			),
		);
	}
}
