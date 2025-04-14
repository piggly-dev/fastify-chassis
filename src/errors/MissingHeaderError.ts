import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when header is missing.
 * @since 7.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MissingHeaderError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Missing header.
	 * Code: 3591606515
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} header The header name.
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof MissingHeaderError
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		header: string,
		message?: string,
		hint?: string,
		extra?: Record<string, any>,
	) {
		super(
			'MissingHeaderError',
			crc32('MissingHeaderError'),
			message || 'Missing header.',
			422,
			hint || `The "${header}" header is required.`,
			extra,
		);
	}
}
