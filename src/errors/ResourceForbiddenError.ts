import { ApplicationError } from '@piggly/ddd-toolkit';

/**
 * @file The error to be thrown when the requested resource is forbidden.
 * @since 5.4.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class ResourceForbiddenError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 * Useful for: Resource forbidden.
	 * Code: 641414657
	 *
	 * It is not an default Error class, it is a domain error.
	 * Should be not thrown, but used as a domain error.
	 * You may use it to return in a Result object from @piggly/ddd-toolkit.
	 *
	 * @param {string} hint The error hint.
	 * @param {string} message The error message.
	 * @param {Record<string, any>} extra The extra data.
	 * @memberof ResourceForbiddenError
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(hint: string, message?: string, extra?: Record<string, any>) {
		super(
			'ResourceForbiddenError',
			message ?? `Cannot access resource.`,
			403,
			hint,
			extra,
		);
	}
}
