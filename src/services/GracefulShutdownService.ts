import { ServiceProvider, LoggerService } from '@piggly/ddd-toolkit';
import EventBus from '@piggly/event-bus';
import debug from 'debug';

import type { CleanUpService } from '@/services/CleanUpService.js';

/**
 * @file Handle graceful shutdown of the service.
 * @copyright Piggly Lab 2025
 * @since 7.5.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class GracefulShutdownService {
	/**
	 * The cleanup service to use.
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected cleanup?: CleanUpService;

	/**
	 * Whether the service is shutting down.
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected is_shutting_down: boolean = false;

	/**
	 * The timeout in milliseconds.
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected timeout: number;

	/**
	 * Constructor.
	 * @param {CleanUpService} cleanup The cleanup service to use.
	 * @param {number} timeout The timeout in milliseconds. Default is 30000.
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(cleanup?: CleanUpService, timeout: number = 30000) {
		this.timeout = timeout;
		this.cleanup = cleanup;
	}

	/**
	 * Get the cleanup service.
	 *
	 * @returns {CleanUpService}
	 * @throws {Error} If cleanup service is not provided.
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get handlers(): CleanUpService {
		if (!this.cleanup) {
			throw new Error('Cleanup service must be provided');
		}

		return this.cleanup;
	}

	/**
	 * Fetch the cleanup service.
	 * Useful when you want to delay the cleanup to a later time.
	 *
	 * E.g: You want to listen for shutdown signals and it can
	 * happen before the cleanup service is ready.
	 *
	 * If "cleanup" is not provided, it will try to load the cleanup service
	 * from the ServiceProvider.
	 *
	 * @param {CleanUpService} cleanup The cleanup service to use.
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public fetch(cleanup?: CleanUpService): void {
		this.cleanup = cleanup ?? ServiceProvider.get('CleanUpService');
		debug('app:shutdown')(
			`Fetched cleanup service: ${this.cleanup === undefined ? 'NO' : 'YES'}`,
		);
	}

	/**
	 * Listen for shutdown signals.
	 *
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public listen(): void {
		process.on('SIGINT', () => this._shutdown('SIGINT'));
		process.on('SIGTERM', () => this._shutdown('SIGTERM'));
		process.on('SIGHUP', () => this._shutdown('SIGHUP'));

		debug('app:shutdown')('Listening for shutdown signals...');
	}

	/**
	 * Listen for uncaught exceptions and rejections.
	 *
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public listenUncaught(): void {
		const handler = async (reason: any, origin: any) => {
			debug('app:uncaught')(reason, origin);
			debug('app:shutdown:uncaught')('Uncaught exception, shutting down...');

			await EventBus.instance.cleanup();
			const logger = LoggerService.softResolve();

			logger.error('UNCAUGHT_EXCEPTION_ERROR', reason, origin);
			logger.flush();
			await logger.cleanup();

			await this._shutdown('UNCAUGHT_EXCEPTION');
		};

		process.on('uncaughtException', handler);
		process.on('unhandledRejection', handler);
	}

	/**
	 * Listen for user signals.
	 *
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public listenUSR(): void {
		process.on('SIGUSR1', () => this._shutdown('SIGUSR1'));
		process.on('SIGUSR2', () => this._shutdown('SIGUSR2'));
	}

	/**
	 * Shutdown the service.
	 *
	 * @returns {Promise<void>}
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async shutdown(): Promise<void> {
		await this._shutdown('MANUAL');
	}

	/**
	 * Clean up the service.
	 *
	 * @returns {Promise<boolean>}
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async _clean(): Promise<boolean> {
		try {
			LoggerService.softResolve().flush();

			await Promise.all([
				EventBus.instance.cleanup(),
				LoggerService.softResolve().cleanup(),
			]);

			if (this.cleanup) {
				const response = await this.cleanup.softClean();
				return response.success;
			}

			return true;
		} catch (error) {
			debug('app:shutdown:error')(error);
			return false;
		}
	}

	/**
	 * Shutdown the service.
	 *
	 * @param {string} signal The signal that triggered the shutdown.
	 * @returns {Promise<void>}
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private async _shutdown(signal: string): Promise<void> {
		if (this.is_shutting_down) {
			debug('app:shutdown')('Already shutting down, skipping...');
			return;
		}

		this.is_shutting_down = true;
		debug('app:shutdown')(`Received ${signal} signal, shutting down...`);

		const timeout = setTimeout(() => {
			debug('app:shutdown')('Graceful shutdown timed out, forcing exit...');
			process.exit(1);
		}, this.timeout);

		const response = await this._clean();
		clearTimeout(timeout);

		if (!response) {
			debug('app:shutdown')('Failed to clean up, forcing exit...');
			process.exit(1);
		}

		debug('app:shutdown')('Shutdown completed successfully');
		process.exit(0);
	}

	/**
	 * Resolve the graceful shutdown service.
	 * It will load the CleanUpService from the ServiceProvider.
	 *
	 * @param {number} timeout The timeout in milliseconds. Default is 30000.
	 * @returns {GracefulShutdownService}
	 * @since 7.5.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(timeout: number = 30000): GracefulShutdownService {
		const service = new GracefulShutdownService(
			ServiceProvider.get('CleanUpService'),
			timeout,
		);

		return service;
	}
}
