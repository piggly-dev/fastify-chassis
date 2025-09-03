import { ApplicationError } from '@piggly/ddd-toolkit';

/**
 * @file This error should be thrown when the rate limit is exceeded.
 * @since 5.5.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class TooManyRequestsError extends ApplicationError {
	/**
	 * Create a new error.
	 * Useful for: Too many requests.
	 * Code: 2473277220
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} after The time to retry.
	 * @memberof TooManyRequestsError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(after: string) {
		super(
			'TooManyRequestsError',
			'Too many requests.',
			429,
			`Rate limit exceeded. Retry in ${after}.`,
		);
	}
}
