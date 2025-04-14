import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when crendentials is not allowed.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class UnauthorizedError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Unauthorized.
	 * Code: 1134170825
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof UnauthorizedError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'UnauthorizedError',
			crc32('UnauthorizedError'),
			message || 'Credentials not allowed.',
			401,
			hint || 'Your credentials are invalid or expired.',
			extra,
		);
	}
}
