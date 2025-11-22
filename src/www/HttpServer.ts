import { ServiceProvider, LoggerService } from '@piggly/ddd-toolkit';

import type {
	ApiDefaultEnvironment,
	HttpServerInterface,
	ApiServerInterface,
} from '@/types/index.js';
import type { CleanUpService } from '@/services/index.js';

/**
 * @file The HTTP server.
 * @copyright Piggly Lab 2023
 */
export class HttpServer<AppEnvironment extends ApiDefaultEnvironment>
	implements HttpServerInterface<any, AppEnvironment>
{
	/**
	 * The API server.
	 *
	 * @protected
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _api;

	/**
	 * The running state.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _running: boolean;

	/**
	 * Create a new HTTP server.
	 *
	 * @param api The API server.
	 * @public
	 * @constructor
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(api: ApiServerInterface<any, AppEnvironment>) {
		this._api = api;
		this._running = false;
	}

	/**
	 * Get the API server.
	 *
	 * @public
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getApi() {
		return this._api;
	}

	/**
	 * Check if the server is running.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isRunning(): boolean {
		return this._running;
	}

	/**
	 * Restart the server.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async restart(): Promise<boolean> {
		await this.stop();
		await this.start();
		return this._running;
	}

	/**
	 * Start the server.
	 * It will auto add current server to cleanup service if it is registered.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async start(): Promise<boolean> {
		this._running = await this.listen();

		if (this._running) {
			const service = ServiceProvider.get<CleanUpService>('CleanUpService');

			if (service) {
				const { name } = this._api.getEnv().api.rest;

				service.register(`fastify:server:${name}`, async () => {
					return await this.stop();
				});
			}
		}

		return this._running;
	}

	/**
	 * Stop the server.
	 *
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async stop(): Promise<boolean> {
		const logger = this.getLogger();
		logger.info('⚠️ HttpServer: Stopping server');

		const response = await new Promise<boolean>((res, rej) => {
			if (!this.isRunning()) {
				res(true);
				return;
			}

			this._api
				.getApp()
				.close()
				.then(
					() => {
						logger.info('⚡️ HttpServer: Server was closed with success');
						res(true);
					},
					(err: Error) => {
						logger.error(
							'⛔ HttpServer: An unexpected error happened while closing server',
							err,
						);

						rej(err);
					},
				)
				.catch((err: Error) => {
					logger.error(
						'⛔ HttpServer: An unexpected error happened while closing server',
						err,
					);

					rej(err);
				});
		});

		this._running = !response;
		return this._running;
	}

	/**
	 * Get the logger.
	 *
	 * @returns {LoggerService}
	 * @protected
	 * @memberof HttpServer
	 * @since 5.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getLogger(): LoggerService {
		return LoggerService.softResolve();
	}

	/**
	 * Listen to the server.
	 *
	 * @returns {Promise<boolean>}
	 * @protected
	 * @async
	 * @memberof HttpServer
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async listen(): Promise<boolean> {
		const logger = this.getLogger();

		if (this.isRunning()) {
			logger.warn('⚠️ HttpServer: Server is already running');

			return new Promise(res => {
				res(false);
			});
		}

		return new Promise((res, rej) => {
			const { host, port } = this._api.getEnv().api.rest;

			this._api.getApp().listen({ host, port }, (err, address) => {
				if (err) {
					logger.error(
						'⛔ HttpServer: Error while starting to listen on host',
						err,
					);

					return rej(err);
				}

				logger.info(
					`⚡️ HttpServer: Server is running at ${host}:${port} - ${address}`,
				);

				res(true);
			});
		});
	}
}
