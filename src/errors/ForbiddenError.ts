import { ApplicationError } from '@piggly/ddd-toolkit';

/**
 * @file This error should be thrown when access is not allowed.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class ForbiddenError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Access not allowed.
	 * Code: 1209582122
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} [message] The error message.
	 * @param {string} [hint] The error hint.
	 * @param {Record<string, any>} [extra] The extra data.
	 * @memberof ForbiddenError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(message?: string, hint?: string, extra?: Record<string, any>) {
		super(
			'ForbiddenError',
			message || 'Access not allowed.',
			403,
			hint || "You don't have enough permissions for this request.",
			extra,
		);
	}
}
