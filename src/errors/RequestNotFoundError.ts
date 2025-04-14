import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when request is not found.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class RequestNotFoundError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Request not found.
	 * Code: 3786660369
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof RequestNotFoundError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'RequestNotFoundError',
			crc32('RequestNotFoundError'),
			message || 'Cannot access requested URL.',
			404,
			hint || 'You must check the URL or the request parameters.',
			extra,
		);
	}
}
