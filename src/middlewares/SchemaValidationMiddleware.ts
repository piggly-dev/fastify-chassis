import type {
	HookHandlerDoneFunction,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import { evaluateSchema, DomainError, Result } from '@piggly/ddd-toolkit';
import { z } from 'zod';

import { replyError, getBody } from '@/utils/index.js';

/**
 * SchemaValidationMiddleware is a middleware that validates the request
 * body, headers, params and querystring against the provided Zod schemas.
 *
 * It will replace the request body, headers, params and querystring with
 * the validated data.
 *
 * @param {Object} schemas - The schemas to validate the request against.
 * @param {z.ZodType} schemas.body - The schema to validate the request body against.
 * @param {z.ZodType} schemas.headers - The schema to validate the request headers against.
 * @param {z.ZodType} schemas.params - The schema to validate the request params against.
 * @param {z.ZodType} schemas.querystring - The schema to validate the request querystring against.
 * @returns The middleware function.
 * @since 1.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const SchemaValidationMiddleware =
	(schemas: {
		body?: z.ZodType<any>;
		headers?: z.ZodType<any>;
		params?: z.ZodType<any>;
		querystring?: z.ZodType<any>;
	}) =>
	(
		request: FastifyRequest,
		reply: FastifyReply,
		done: HookHandlerDoneFunction,
	) => {
		let result: Result<any, DomainError> = Result.ok(true);

		if (schemas.body) {
			result = evaluateSchema('body', getBody(request), schemas.body);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.body = result.data;
		}

		if (schemas.headers) {
			result = evaluateSchema('headers', request.headers, schemas.headers);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.headers = result.data;
		}

		if (schemas.params) {
			result = evaluateSchema('params', request.params, schemas.params);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.params = result.data;
		}

		if (schemas.querystring) {
			result = evaluateSchema(
				'querystring',
				request.query,
				schemas.querystring,
			);

			if (result.isFailure) {
				return replyError(reply, result as Result<never, DomainError>);
			}

			request.query = result.data;
		}

		done();
	};
