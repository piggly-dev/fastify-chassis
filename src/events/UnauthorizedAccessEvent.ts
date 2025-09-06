import type { FastifyRequest } from 'fastify';

import { EventPayload, EventBus } from '@piggly/event-bus';
import { LoggerService } from '@piggly/ddd-toolkit';

import type {
	UnauthorizedAccessEventPayload,
	EventOptions,
} from '@/events/types/index.js';

import { getIp } from '@/utils/index.js';

/**
 * @file This event should be published when an unauthorized access occurs.
 * @since 7.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class UnauthorizedAccessEvent extends EventPayload<UnauthorizedAccessEventPayload> {
	/**
	 * Create a new instance of the event.
	 *
	 * You may issue this event when a request is unauthorized for
	 * any reason such as: 401 or 403 HTTP responses.
	 *
	 * @param {FastifyRequest} request The request.
	 * @memberof UnauthorizedAccessEvent
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(request: FastifyRequest) {
		super('UNAUTHORIZED_ACCESS_EVENT', {
			ip: getIp(request),
			method: request.method,
			url: request.url,
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
	 * It will be logged as warn when log is true. with parameters:
	 * - event: UNAUTHORIZED_ACCESS_EVENT
	 * - ip: ip
	 * - method: method
	 * - url: url
	 *
	 * If you enable FileLogStreamService on LoggerService, the message will be:
	 * [date-time] [uuid] (warn) "UNAUTHORIZED_ACCESS_EVENT" - "ip" - "method" - "url"
	 *
	 * @param {FastifyRequest} request The request. The current IP will be collected from the request.
	 * @param {EventOptions} options The options.
	 * @memberof UnauthorizedAccessEvent
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static publish(
		request: FastifyRequest,
		options: EventOptions = { log: true, wait_onclean: false },
	): void {
		const event = new UnauthorizedAccessEvent(request);

		if (options.log) {
			LoggerService.softResolve().warn(
				'UNAUTHORIZED_ACCESS_EVENT',
				event.data.ip,
				event.data.method,
				event.data.url,
			);
		}

		EventBus.instance.send(event, options.wait_onclean);
	}
}
