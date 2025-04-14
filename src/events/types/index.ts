/**
 * Content of the ApplicationErrorEvent.
 *
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type ApplicationErrorEventPayload = {
	error: string;
	hash: string;
	raw: Error;
};

/**
 * Content of the DependencyErrorEvent.
 *
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type DependencyErrorEventPayload = Error;

/**
 * Content of the UnauthorizedAccessEvent.
 * It will be related to current request.
 *
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type UnauthorizedAccessEventPayload = {
	ip: string;
	method: string;
	url: string;
};

/**
 * Options for the event.
 *
 * - log: If true, the event will be logged.
 * - wait_onclean: If true, the event will be sent as wait_onclean. It means
 *   that in a graceful shutdown or interruption, application will wait for
 *   the event to be processed before shutting down.
 *
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type EventOptions = Partial<{
	log: boolean;
	wait_onclean: boolean;
}>;
