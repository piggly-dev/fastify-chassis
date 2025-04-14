import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file The error to be thrown when the requested service is unavailable.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class ServiceUnavailableError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 * Useful for: Service unavailable.
	 * Code: 1668863794
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} message The error message.
	 * @param {string} hint The error hint.
	 * @param {Record<string, any>} extra The extra data.
	 * @memberof ServiceUnavailableError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'ServiceUnavailableError',
			crc32('ServiceUnavailableError'),
			message ?? `Requested service is unavailable.`,
			503,
			hint ?? `You may try again later.`,
			extra,
		);
	}
}
