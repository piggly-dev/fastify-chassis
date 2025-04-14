import type { RawServerBase } from 'fastify';

import { ServiceProvider, LoggerService } from '@piggly/ddd-toolkit';
import EventBus from '@piggly/event-bus';
import debug from 'debug';

import type { HttpServerInterface, DefaultEnvironment } from '@/types';

import { CleanUpService } from '@/services';

/**
 * Cleanup dependencies.
 * It will run the CleanUpService to clean all registered dependencies.
 *
 * It will wait for:
 * - EventBus cleanup;
 * - LoggerService flush and cleanup.
 *
 * You may not need to cleanup classes above when using this.
 *
 * @param {HttpServerInterface<Server, AppEnvironment> | undefined} server
 * @returns {Promise<number>}
 * @since 5.5.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const cleanupDependencies =
	<Server extends RawServerBase, AppEnvironment extends DefaultEnvironment>(
		server?: HttpServerInterface<Server, AppEnvironment>,
	): (() => Promise<number>) =>
	async (): Promise<number> => {
		try {
			if (server) {
				await server.stop();
			}

			const service = ServiceProvider.get<CleanUpService>('CleanUpService');

			if (service) {
				// Register the EventBus cleanup.
				await EventBus.instance.cleanup();
				LoggerService.softResolve().flush();
				await LoggerService.softResolve().cleanup();

				const response = await service.softClean();
				return response.success ? 0 : 1;
			}

			return 0;
		} catch (error) {
			/* eslint-disable-next-line no-console */
			console.error(error);
			debug('app:cleanup:error')(error);

			return 1;
		}
	};
