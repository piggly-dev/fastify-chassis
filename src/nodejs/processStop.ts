/* eslint-disable no-console */
import { LoggerService } from '@piggly/ddd-toolkit';
import EventBus from '@piggly/event-bus';

/**
 * Process stop error.
 *
 * @deprecated Use GracefulShutdownService instead. It will be removed in the next major version.
 * @param {Object} opts The options.
 * @param {boolean} opts.debug Whether to log debug messages. Default is false.
 * @param {() => Promise<number>} beforeExit
 * @param {number} exitCode Used when beforeExit is not provided. Default is 0.
 * @returns The callback function.
 * @since 5.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const processStop =
	(
		opts: { debug?: boolean } = {},
		beforeExit?: () => Promise<number>,
		exitCode: number = 1,
	) =>
	async () => {
		try {
			await EventBus.instance.cleanup();
			LoggerService.softResolve().flush();
			await LoggerService.softResolve().cleanup();

			console.log('⚠️ Command is stopping... Please wait a moment.');
			if (beforeExit) {
				return process.exit(await beforeExit());
			}

			process.exit(0);
		} catch (err) {
			if (opts.debug === true) {
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
