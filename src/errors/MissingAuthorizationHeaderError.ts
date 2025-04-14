import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when authorization header is missing.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MissingAuthorizationHeaderError extends ApplicationError {
	/**
	 * Create a new error.
	 * 3284422397
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof MissingAuthorizationHeaderError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'MissingAuthorizationHeaderError',
			crc32('MissingAuthorizationHeaderError'),
			message || 'Invalid authorization header.',
			401,
			hint || 'The `Authorization` header is required.',
			extra,
		);
	}
}
