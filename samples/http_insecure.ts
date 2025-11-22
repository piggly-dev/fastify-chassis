/* eslint-disable no-console */
import type {
	RouteGenericInterface,
	FastifyInstance,
	FastifyRequest,
	FastifyReply,
} from 'fastify';

import { Server } from 'http';
import path from 'path';
import fs from 'fs';

import { ServiceProvider, LoggerService } from '@piggly/ddd-toolkit';
import fastifyRateLimit from '@fastify/rate-limit';

import {
	FastifyModifierCallable,
	ApiDefaultEnvironment,
	ApiServerOptions,
} from '@/types';
import { RequestNotFoundError, RequestServerError } from '@/errors';
import { HttpInsecureServer, FastifyModifiers } from '@/www';

type ApiEnvironment = {
	api: { rate: { requests: number } };
	app: { root_path: string; timezone: string };
} & ApiDefaultEnvironment;

type ApiReply = FastifyReply<RouteGenericInterface, ApiServer>;

type ApiRequest = FastifyRequest<RouteGenericInterface, ApiServer>;
type ApiServer = Server;

const env: ApiEnvironment = {
	api: {
		rate: {
			requests: 30,
		},
		rest: {
			host: '0.0.0.0',
			name: 'http-insecure',
			port: 3005,
		},
	},
	app: {
		root_path: path.resolve(__dirname), // The root path of the application.
		timezone: 'UTC',
	},
	debug: true,
	environment: 'development',
};

const HelloWorldRoute =
	(deps: { LOGGER: LoggerService }) =>
	async (request: ApiRequest, reply: ApiReply): Promise<any> => {
		deps.LOGGER.info('🎉 Hello world route called', { param: 'sample' }, 10);
		return reply.status(200).send({ data: 'Hello world!', status: 'ok' });
	};

const PublicApiRoutes: FastifyModifierCallable<ApiServer> = (
	app: FastifyInstance<ApiServer>,
): Promise<void> => {
	app.register(
		(fastify, options, done) => {
			fastify.get(
				'/hello',
				HelloWorldRoute({
					LOGGER: ServiceProvider.resolve('LoggerService'),
				}),
			);
			done();
		},
		{
			prefix: '/v1',
		},
	);

	return Promise.resolve();
};

const rateLimitPlugin: FastifyModifierCallable<
	ApiServer,
	ApiEnvironment
> = async (app, env) => {
	await app.register(fastifyRateLimit, {
		max: env.api.rate.requests,
		timeWindow: '1 minute',
	});
};

const plugins = new FastifyModifiers<ApiServer, ApiEnvironment>(
	rateLimitPlugin,
);

const beforeInit: FastifyModifierCallable<
	ApiServer,
	ApiEnvironment
> = async () => {
	console.log('Do something before fastify init, such as startup processes.');
};

const afterInit: FastifyModifierCallable<
	ApiServer,
	ApiEnvironment
> = async () => {
	console.log(
		'Do something after fastify init, such as register onClose hook.',
	);
};

const ApiLogger = new LoggerService({
	alwaysOnConsole: false,
	callbacks: {
		onDebug: async (message, ...args) => console.debug(message, ...args),
		onError: async (message, ...args) => console.error(message, ...args),
		onFatal: async (message, ...args) => console.error(message, ...args),
		onInfo: async (message, ...args) => console.info(message, ...args),
		onWarn: async (message, ...args) => console.warn(message, ...args),
	},
	ignoreUnset: false,
});

const options: ApiServerOptions<ApiServer, ApiEnvironment> = {
	env,
	errors: {
		// run to all unchaught errors
		notFound: new RequestNotFoundError(),
		unknown: new RequestServerError(),
	},
	fastify: { logger: false },
	hooks: { afterInit, beforeInit },
	logger: ApiLogger,
	plugins,
	routes: new FastifyModifiers<ApiServer, ApiEnvironment>(PublicApiRoutes),
};

const serverUncaught = (reason: any, origin: any) => {
	const errs = [];
	errs.push('❌ An error has occurred');

	if (origin) {
		errs.push(`at: ${origin}`);
	}

	if (reason) {
		errs.push(`reason: ${reason.stack || reason}`);
	}

	const err = `[${new Date().toISOString()}] > ${errs.join(', ')}.\n`;
	console.error(err);

	fs.appendFileSync(`${env.app.root_path}/logs/error.log`, err);
	process.exit(1);
};

process.on('uncaughtException', serverUncaught);
process.on('unhandledRejection', serverUncaught);

const cleanupDependencies: Array<() => Promise<void>> = [
	async () => {
		console.log('🧹 Cleaning up dependencies...');
	},
];

new HttpInsecureServer(options)
	.bootstrap()
	.then(server => {
		const stopServer = async () => {
			console.log('⚡️Cleaning up all running dependencies...');

			try {
				console.error('❌ Server is stopping... Please wait a moment.');
				await Promise.all(cleanupDependencies);
				await server.stop();

				process.exit(0);
			} catch (err) {
				console.error('❌ Server has failed to stop.');
				console.error(err);
			}
		};

		process.on('SIGINT', stopServer);
		process.on('SIGTERM', stopServer);
		process.on('SIGUSR1', stopServer);
		process.on('SIGUSR2', stopServer);

		server
			.start()
			.then(() =>
				console.log(
					`⚡️ Server has started and it is listening on ${env.api.rest.host}:${env.api.rest.port}.`,
				),
			)
			.catch((err: any) => {
				console.error('❌ Server while starting to listen HTTP port.');
				console.error(err);
				process.exit(1);
			});
	})
	.catch((err: any) => {
		console.error('❌ Server has failed before creating the HTTP server.');
		console.error(err);
		process.exit(1);
	});
