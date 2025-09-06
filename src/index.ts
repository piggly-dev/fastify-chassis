export {
	MissingAuthorizationHeaderError,
	InvalidAuthorizationHeaderError,
	InvalidRequestQueryError,
	InvalidRequestBodyError,
	ServiceUnavailableError,
	RequestApiNotFoundError,
	ResourceForbiddenError,
	InvalidNonceTokenError,
	RequestApiServerError,
	InvalidCSRFTokenError,
	RequestNotFoundError,
	TooManyRequestsError,
	CORSNotAllowedError,
	RequestServerError,
	MissingHeaderError,
	UnauthorizedError,
	ForbiddenError,
} from '@/errors/index.js';

export {
	getHeaderValues,
	evaluateHeaders,
	getBearerToken,
	getHeaderValue,
	getBasicToken,
	replyError,
	getQueries,
	getOrigin,
	mountURL,
	getParam,
	getQuery,
	getBody,
	getIp,
} from '@/utils/index.js';

export {
	CookieBuilderService,
	HealthCheckService,
	EnvironmentService,
	NonceTokenService,
	CSRFTokenService,
	CleanUpService,
	StartupService,
} from '@/services/index.js';

export {
	CookieBuilderServiceSettings,
	CookieOptions,
} from '@/services/index.js';

export type {
	FastifyModifierCallable,
	HttpServerInterface,
	DefaultEnvironment,
	ApiServerInterface,
	FastifyAppliable,
	ApiServerOptions,
	FastifyServer,
} from '@/types/index.js';

export {
	Http2InsecureServer,
	HttpInsecureServer,
	Http2SecureServer,
	HttpSecureServer,
	FastifyModifiers,
	AbstractServer,
	HttpServer,
} from '@/www/index.js';

export {
	UnauthorizedAccessEvent,
	ApplicationErrorEvent,
	DependencyErrorEvent,
} from '@/events/index.js';

export type {
	UnauthorizedAccessEventPayload,
	ApplicationErrorEventPayload,
	DependencyErrorEventPayload,
	EventOptions,
} from '@/events/index.js';

export {
	SchemaValidationMiddleware,
	NonceTokenMiddleware,
	BasicAuthMiddleware,
	CSRFTokenMiddleware,
} from '@/middlewares/index.js';

export {
	CSRFHeaderIssuerRoute,
	CSRFCookieIssuerRoute,
	NonceBodyIssuerRoute,
	HealthCheckRoute,
} from '@/routes/index.js';

export {
	cleanupDependencies,
	processUncaught,
	processStop,
} from '@/nodejs/index.js';

export { LogResponseHook } from '@/hooks/index.js';
