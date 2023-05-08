import fastify, { FastifyError, FastifyInstance } from 'fastify';
import Environment from '@/helpers/Environment';
import Logger from '@/helpers/Logger';
import AbstractError from '@/errors/AbstractError';
import ResponseError from '@/errors/ResponseError';
import {
	ApiServerInterface,
	ApiServerOptions,
	HttpServerInterface,
} from '@/types';
import HttpServer from './HttpServer';

/**
 * The API server.
 *
 *
 */
export default class ApiServer<AppEnvironment extends Record<string, any>>
	implements ApiServerInterface<FastifyInstance, AppEnvironment>
{
	/**
	 * The Fastify application.
	 *
	 * @type {Fastify}
	 * @protected
	 */
	protected _app: FastifyInstance;

	/**
	 * The options.
	 *
	 * @type {ApiServerOptions}
	 * @protected
	 */
	protected _options: ApiServerOptions<FastifyInstance, AppEnvironment>;

	/**
	 * Create a new API server.
	 *
	 * @param options The options.
	 * @returns {void}
	 * @public
	 * @constructor
	 * @memberof ApiServer
	 */
	constructor(options: ApiServerOptions<FastifyInstance, AppEnvironment>) {
		this._options = options;

		this._app = fastify({
			logger: this._options.logger || {
				file: `${this._options.env.log_path}/server.log`,
				level: this._options.env.debug ? 'debug' : 'info',
				transport: {
					target: 'pino-pretty',
					options: {
						translateTime: true,
						colorize: true,
						ignore: 'pid',
						messageFormat:
							'{msg} [id={reqId} method={req.method} url={req.url} statusCode={res.statusCode} responseTime={responseTime}ms hostname={req.hostname}]',
					},
				},
				serializers: {
					req: req => ({
						method: req.method,
						url: req.url,
						hostname: req.hostname,
					}),
					res: res => ({
						statusCode: res.statusCode,
					}),
				},
			},
			trustProxy: true,
		});
	}

	/**
	 * Get the Fastify application.
	 *
	 * @returns {FastifyInstance}
	 * @public
	 * @memberof ApiServer
	 */
	public getApp(): FastifyInstance {
		return this._app;
	}

	/**
	 * Get the global environment.
	 *
	 * @returns {AppEnvironment}
	 * @public
	 * @memberof ApiServer
	 */
	public getEnv(): AppEnvironment {
		return this._options.env;
	}

	/**
	 * Bootstrap the API server.
	 *
	 * This method will prepare the environment, the logger,
	 * the plugins and the routes for fastify.
	 *
	 * After that, it will return a new HttpServer instance.
	 * This instance will be used to start the server.
	 *
	 * @returns {Promise<HttpServerInterface>}
	 * @public
	 * @memberof ApiServer
	 */
	public async bootstrap(): Promise<
		HttpServerInterface<FastifyInstance, AppEnvironment>
	> {
		if (this._options.beforeInit) {
			await this._options.beforeInit(this._app, this._options.env);
		}

		await this.init();

		if (this._options.afterInit) {
			await this._options.afterInit(this._app, this._options.env);
		}

		return new HttpServer(this);
	}

	/**
	 * Initialize the API server.
	 *
	 * @returns {Promise<void>}
	 * @protected
	 * @memberof ApiServer
	 */
	protected async init(): Promise<void> {
		// Prepare application logger
		Logger.prepare(this._app.log);
		// Prepare global environment
		Environment.prepare(this._options.env);

		// Plugins
		await this._options.plugins.apply(this._app, this._options.env);

		// Routes
		await this._options.routes.apply(this._app, this._options.env);

		// Not found routes
		this._app.setNotFoundHandler((request, reply) => {
			reply.status(404).send(this._options.errors.notFound.toJSON());
		});

		// Any error
		this._app.setErrorHandler<AbstractError | ResponseError | FastifyError>(
			(error, request, reply) => {
				if (error instanceof AbstractError) {
					const _error = error.toResponse();
					this._app.log.error(_error.toJSON());
					return reply.status(_error.getHttpCode()).send(_error.toJSON());
				}

				const JSON = {
					code: error.code,
					status: 500,
					name: error.name,
					message: error.message,
				};

				this._app.log.error(JSON);
				return reply.status(500).send({
					...this._options.errors.unknown.toJSON(),
					...JSON,
				});
			}
		);
	}
}
