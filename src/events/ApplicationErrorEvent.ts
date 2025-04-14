import { EventPayload, EventBus } from '@piggly/event-bus';
import { LoggerService } from '@piggly/ddd-toolkit';

import { ApplicationErrorEventPayload, EventOptions } from './types';

/**
 * @file This event should be published when an error occurs.
 * @since 7.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class ApplicationErrorEvent extends EventPayload<ApplicationErrorEventPayload> {
	/**
	 * Create a new instance of the event.
	 *
	 * @param {Error} error The error.
	 * @param {string} hash The hash.
	 * @memberof ApplicationErrorEvent
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(error: Error, hash: string) {
		super('APPLICATION_ERROR_EVENT', {
			error: error.message,
			hash,
			raw: error,
		});
	}

	/**
	 * Publish the event.
	 *
	 * This event should be completed on a graceful shutdown or interruption.
	 * But use carrefully, as it will heavily increase memory usage if you have a lot of
	 * events to wait.
	 *
	 * If you don't use the EventBus.interface.cleanup you
	 * may change flag removing "wait_onclean" to false when
	 * publishing this event.
	 *
	 * It will be logged as error when log is true. with parameters:
	 * - event: APPLICATION_ERROR_EVENT
	 * - hash: hash
	 * - message: error.message
	 * - stack: error.stack
	 *
	 * If you enable FileLogStreamService on LoggerService, the message will be:
	 * [date-time] [uuid] (error) "APPLICATION_ERROR_EVENT" - "hash" - "error.message" - "error.stack"
	 *
	 * @param {Error} error The error.
	 * @param {string} hash The hash.
	 * @param {EventOptions} options The options.
	 * @public
	 * @static
	 * @memberof ApplicationErrorEvent
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static publish(
		error: Error,
		hash: string,
		options: EventOptions = { log: true, wait_onclean: true },
	): void {
		const event = new ApplicationErrorEvent(error, hash);

		if (options.log) {
			LoggerService.softResolve().error(
				`APPLICATION_ERROR_EVENT`,
				hash,
				error.message,
				error.stack,
			);
		}

		EventBus.instance.send(event, options.wait_onclean);
	}
}
