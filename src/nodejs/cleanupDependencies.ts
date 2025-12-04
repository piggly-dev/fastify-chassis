import { ServiceProvider, LoggerService } from '@piggly/ddd-toolkit';
import EventBus from '@piggly/event-bus';
import debug from 'debug';

import type { CleanUpService } from '@/services/index.js';

/**
 * Cleanup dependencies.
 * It will run the CleanUpService to clean all registered dependencies.
 *
 * HTTP Server will be automatically cleaned up if it is registered in the CleanUpService.
 *
 * It will wait for:
 * - EventBus cleanup;
 * - LoggerService flush and cleanup.
 *
 * You may not need to cleanup classes above when using this.
 *
 * @deprecated Use GracefulShutdownService instead. It will be removed in the next major version.
 * @returns {Promise<number>}
 * @since 7.3.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const cleanupDependencies = async (): Promise<number> => {
	try {
		await EventBus.instance.cleanup();
		LoggerService.softResolve().flush();
		await LoggerService.softResolve().cleanup();

		const service = ServiceProvider.get<CleanUpService>('CleanUpService');

		if (service) {
			const response = await service.softClean();
			return response.success ? 0 : 1;
		}

		return 0;
	} catch (error) {
		debug('app:cleanup:error')(error);
		return 1;
	}
};
