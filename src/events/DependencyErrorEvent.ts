import { EventPayload, EventBus } from '@piggly/event-bus';
import { LoggerService } from '@piggly/ddd-toolkit';

import type {
	DependencyErrorEventPayload,
	EventOptions,
} from '@/events/types/index.js';

/**
 * @file This event should be published when a dependency error occurs.
 * @since 7.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class DependencyErrorEvent extends EventPayload<DependencyErrorEventPayload> {
	/**
	 * Create a new instance of the event.
	 *
	 * @param {Error} error The error.
	 * @memberof DependencyErrorEvent
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(error: Error) {
		super('DEPENDENCY_ERROR_EVENT', error);
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
	 * - event: DEPENDENCY_ERROR_EVENT
	 * - message: error.message
	 * - stack: error.stack
	 *
	 * If you enable FileLogStreamService on LoggerService, the message will be:
	 * [date-time] [uuid] (error) "DEPENDENCY_ERROR_EVENT" - "error.message" - "error.stack"
	 *
	 * @param {Error} error The error.
	 * @param {EventOptions} options The options.
	 * @memberof DependencyErrorEvent
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static publish(
		error: Error,
		options: EventOptions = { log: true, wait_onclean: false },
	): void {
		const event = new DependencyErrorEvent(error);

		if (options.log) {
			LoggerService.softResolve().error(
				`DEPENDENCY_ERROR_EVENT`,
				error.message,
				error.stack,
			);
		}

		EventBus.instance.send(event, options.wait_onclean);
	}
}
