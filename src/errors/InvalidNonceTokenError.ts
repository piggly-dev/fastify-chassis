import { ApplicationError } from '@piggly/ddd-toolkit';
import { crc32 } from 'crc';

/**
 * @file This error should be thrown when access is not allowed.
 * @since 7.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidNonceTokenError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Invalid nonce token.
	 * Code: 4144331887
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof InvalidNonceTokenError
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'InvalidNonceTokenError',
			crc32('InvalidNonceTokenError'),
			message || 'Invalid nonce token.',
			403,
			hint || 'The provided nonce token is invalid.',
			extra,
		);
	}
}
