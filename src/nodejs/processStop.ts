/* eslint-disable no-console */
import { LoggerService } from '@piggly/ddd-toolkit';
import EventBus from '@piggly/event-bus';

import type { DefaultEnvironment } from '@/types/index.js';

/**
 * Process stop error.
 *
 * It will wait for:
 * - EventBus cleanup;
 * - LoggerService flush and cleanup.
 *
 * You may not need to cleanup classes above when using this.
 *
 * @param {Environment} env
 * @param {() => Promise<number>} beforeExit
 * @param {number} exitCode Used when beforeExit is not provided. Default is 0.
 * @returns The callback function.
 * @since 5.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const processStop =
	<Environment extends DefaultEnvironment>(
		env: Environment,
		beforeExit?: () => Promise<number>,
		exitCode: number = 1,
	) =>
	async () => {
		try {
			console.log('⚠️ Command is stopping... Please wait a moment.');
			await EventBus.instance.cleanup();

			const logger = LoggerService.softResolve();

			logger.flush();
			await logger.cleanup();

			if (beforeExit) {
				return process.exit(await beforeExit());
			}

			process.exit(0);
		} catch (err) {
			if (env.debug === true) {
				console.error('❌ Command has failed to stop.');
				console.error(err);
			}

			const logger = LoggerService.softResolve();

			logger.error('UNCAUGHT_EXCEPTION_ERROR', err);
			logger.flush();
			await logger.cleanup();

			process.exit(exitCode);
		}
	};
