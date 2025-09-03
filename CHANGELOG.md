# Changelog

## 1.0.0 at (`2023-06-02`)

* First release.

## 1.0.1 at (`2023-06-07`)

* Dependencies update.

## 1.1.0 at (`2023-10-28`)

* Dependencies update.

## 2.0.0 at (`2023-10-29`)

* Improvements types definitions to make it easier to use;
* Adds `HttpInsecureServer`, `HttpSecureServer`, `Http2InsecureServer` e `Http2SecureServer` classes;
* Removes `ApiServer` class;
* Adds `./samples` folder.

## 2.1.0 at (`2023-10-29`)

* Adds `disableRequestLogging` flag for production environments;
* Allow replacing default options for fastify.

## 3.0.0 at (`2024-03-28`)

* Refactoring all errors.

## 3.1.0 at (`2024-04-10`)

* Add response data to `RuntimeError`;
* Interpreting `RuntimeError` in the fastify default error handler in `AbstractServer` class;
* Add a custom error handler in the `ApiServer` class options.

## 4.0.0 at (`2024-06-07`)

* Dependencies update;
* Break changes in the `BaseController` class, see samples for more information;
* Break changes on errors, `ApplicationError` and `RuntimeError` moved to `@piggly/ddd-toolkit` package;
* Break changes on types, generic types moved to `@piggly/ddd-toolkit` package;
* Added `SyncErrorOnDiskHandler` to log errors in a log file;
* Added `HealthCheckService` to check the server status based on handlers available, useful to run in a route to check if the server is healthy;
* Named exportation to be fully compatible with ESM.

## 4.0.1 at (`2024-06-07`)

* ESM/CommonJS/Types compatibility.

## 4.0.2 at (`2024-06-18`)

* Fix on `getBasicToken` util function;
* Allow `getIp` and `getOrigin` define custom headers;

## 4.0.3 at (`2024-06-19`)

* Fix on `getIp` and `getOrigin` util functions.

## 5.4.0 at (`2025-03-03`)

* Add `audience` param to `JWTBuilderService` methods;
* Add `domain` and `secure` params to `CookieBuilderService` methods;
* Add `getHeaderValue`, `getHeaderValues` and `evaluateHeaders` utils;
* Add `SchemaValidationMiddleware` and `BasicAuthMiddleware` middlewares;
* Add `ApplicationErrorEvent`, `DependencyErrorEvent` and `UnauthorizedAccessEvent` events;
* Add many errors, see `./errors` folder for more information;
* Fix `LoggerService` behavior to be able to register it before create `AbstractServer` instance, sometimes you may want to register logger before to handle application dependencies logging;
* Keep compatibility with previous versions.

## 5.5.0 at (`2025-03-06`)

* Add `softResolve` method to `LoggerService` to allow soft resolve the logger service;
* Add new errors, see `./errors` folder for more information;
* Add `cleanupDependencies` function to cleanup dependencies;
* Add a `sanitizeRecursively` util function to sanitize HTML data recursively;
* Fix on `BasicAuthMiddleware` which was not working as expected;
* Keep compatibility with previous versions.

## 6.0.0 at (`2025-03-07`)

* Break changes, migrating classes and functions to `@piggly/ddd-toolkit` package, see:
  * `JWTBuilderService` class;
  * `CryptoService` class;
  * `LoggerService` class;
  * `evaluateSchema` function;
  * `sanitizeRecursively` function;
  * `loadConfigIni` function;
  * `loadDotEnv` function;
  * `loadYaml` function;
  * `EnvironmentType` type;
  * `InvalidPayloadSchemaError` error.

## 7.0.0 at (`2025-04-14`)

* Update all dependencies to the latest version;
* Add `MissingHeaderError` error;
* Add `InvalidNonceTokenError` error;
* Add `InvalidCSRFTokenError` error;
* Add more contextual data to errors at comments;
* `ApplicationErrorEvent`, `DependencyErrorEvent` and `UnauthorizedAccessEvent` will use LoggerService to auto log them;
* Remove `SyncErrorOnDiskHandler`. It is recommended to enable `FileLogStreamService` on LoggerService to logging errors to files;
* Remove `AuditRequestLogger` hook. It is recommended to use `LogResponseHook` instead;
* Remove `logErrorOnFile` function. It is recommended to enable `FileLogStreamService` on LoggerService to logging errors to files;
* Change `cleanupDependencies`, `processUncaught` and `processStop` functions to wait for EventBus cleanup and LoggerService flush and cleanup;
* Add CSRF and Nonce token middlewares;
* Add general routes for health check, CSRF token and Nonce token;
* Overall improvements and optimizations.

## 7.0.1 at `2025-04-15`

* [Fix] Build issues. Updating `tsc-alias` broke all builds.

## 7.0.2 at `2025-05-23`

* [Fix] Errors were not being serialized correctly.

## 7.1.0 at `2025-05-23`

* [Add] Log as debug when `DomainError` (`UNCAUGHT_DOMAIN_ERROR`) and `RuntimeError` (`UNCAUGHT_RUNTIME_ERROR`) happens;
* [Add] Log as error when uncaught error (`UNCAUGHT_ERROR`) happens;
* [Change] Moved error handler to only uncaught errors;
* [Change] Changed `cleanupDependencies` to wait for `EventBus` and `LoggerService` cleanup.

## 7.2.0 at `2025-08-12`

* [Update] Dependencies to the latest version;
* [Fix] Typing issues.

## 7.2.1 at `2025-08-22`

* [Update] Using the alpha version of `@piggly/ddd-toolkit`;
* [Fix] Enhanced debug logging and messages;
* [Change] Deprecated fastify logging, it will always be `false` since now.

## 7.2.2 at `2025-08-31`

* [Update] Using the alpha version of `@piggly/ddd-toolkit`;
* [Uninstall] Removed `moment-timezone` dependency.

## 7.2.3 at `2025-09-02`

* [Update] Using the alpha version of `@piggly/ddd-toolkit`;
* [Uninstall] Removed `crc` dependency.
