import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when the CSRF token is invalid.
 * @since 7.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidCSRFTokenError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Invalid CSRF token.
	 * Code: 1995494138
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof InvalidCSRFTokenError
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'InvalidCSRFTokenError',
			crc32('InvalidCSRFTokenError'),
			message || 'Invalid CSRF token.',
			403,
			hint || 'The provided CSRF token is invalid.',
			extra,
		);
	}
}
