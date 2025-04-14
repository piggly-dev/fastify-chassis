import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when authorization header is invalid.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidAuthorizationHeaderError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Invalid authorization header.
	 * Code: 2210884079
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof InvalidAuthorizationHeaderError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'InvalidAuthorizationHeaderError',
			crc32('InvalidAuthorizationHeaderError'),
			message || 'Invalid authorization header.',
			401,
			hint || 'The `Authorization` header must be of `Bearer` type.',
			extra,
		);
	}
}
