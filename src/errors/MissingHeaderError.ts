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
	 * Code: 3591606515
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
