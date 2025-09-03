import { ApplicationError } from '@piggly/ddd-toolkit';

/**
 * @file This error should be thrown when authorization header is missing.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class MissingAuthorizationHeaderError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Missing authorization header.
	 * Code: 3284422397
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
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
			message || 'Invalid authorization header.',
			401,
			hint || 'The `Authorization` header is required.',
			extra,
		);
	}
}
