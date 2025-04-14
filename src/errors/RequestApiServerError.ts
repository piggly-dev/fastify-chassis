import { randomUUID } from 'crypto';

import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

import { ApplicationErrorEvent } from '@/events';

/**
 * @file The error to be thrown when the requested service is unavailable.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class RequestApiServerError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 * Useful for: Request API server error and auto publish ApplicationErrorEvent when error is set.
	 * Code: 355204257
	 *
	 * It will produce a APPLICATION_ERROR_EVENT if there is an error,
	 * when a new object is created. You may listen to it
	 * to setup notifications or actions.
	 *
	 * @param {any} error The error.
	 * @memberof RequestApiServerError
	 * @since 5.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(error?: any) {
		const hash = randomUUID();

		if (error) {
			ApplicationErrorEvent.publish(error, hash);
		}

		super(
			'RequestApiServerError',
			crc32('RequestApiServerError'),
			'Cannot process the request at this moment.',
			error?.status || 500,
			`Contact administrator and inform the following code: "${hash}".`,
			{},
			error,
		);
	}
}
