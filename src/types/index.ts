import type {
	FastifyBaseLogger,
	RawServerDefault,
	FastifyInstance,
	RawServerBase,
} from 'fastify';
import type {
	EnvironmentType,
	JSONExportable,
	LoggerService,
} from '@piggly/ddd-toolkit';

import type { Http2InsecureServer } from '@/www/fastify/Http2InsecureServer';
import type { HttpInsecureServer } from '@/www/fastify/HttpInsecureServer';
import type { Http2SecureServer } from '@/www/fastify/Http2SecureServer';
import type { HttpSecureServer } from '@/www/fastify/HttpSecureServer';

/** Environment */
export type ApiDefaultEnvironment = DefaultEnvironment;

export type DefaultEnvironment = {
	debug: boolean;
	environment: EnvironmentType;

	api: {
		rest: {
			host: string;
			name: string;
			port: number;
		};
	};
};

/** Fastify server */
export type FastifyServer<
	AppEnvironment extends ApiDefaultEnvironment = ApiDefaultEnvironment,
> =
	| Http2InsecureServer<AppEnvironment>
	| HttpInsecureServer<AppEnvironment>
	| Http2SecureServer<AppEnvironment>
	| HttpSecureServer<AppEnvironment>;

/** Fastify modifiers */
export interface FastifyAppliable<
	Server extends RawServerBase,
	AppEnvironment = ApiDefaultEnvironment,
> {
	apply: FastifyModifierCallable<Server, AppEnvironment>;
}

export type FastifyModifierCallable<
	Server extends RawServerBase,
	AppEnvironment = ApiDefaultEnvironment,
> = (app: FastifyInstance<Server>, env: AppEnvironment) => Promise<void>;

/** Servers */

export interface ApiServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends ApiDefaultEnvironment,
> {
	bootstrap: () => Promise<HttpServerInterface<Server, AppEnvironment>>;
	getApp: () => FastifyInstance<Server>;
	getEnv: () => AppEnvironment;
}

export type ApiServerOptions<
	Server extends RawServerBase = RawServerDefault,
	AppEnvironment = ApiDefaultEnvironment,
> = {
	env: AppEnvironment;
	errors: {
		handler?: (err: any) => void;
		notFound: JSONExportable;
		unknown: JSONExportable;
	};
	/** @deprecated There is no reason to log with fastify. High memory usage and throughput. */
	fastify: { logger?: FastifyBaseLogger | boolean };
	hooks: {
		afterInit?: FastifyModifierCallable<Server, AppEnvironment>;
		beforeInit?: FastifyModifierCallable<Server, AppEnvironment>;
	};
	logger?: LoggerService;
	plugins: FastifyAppliable<Server, AppEnvironment>;
	routes: FastifyAppliable<Server, AppEnvironment>;
};

export interface HttpServerInterface<
	Server extends RawServerBase,
	AppEnvironment extends ApiDefaultEnvironment,
> {
	getApi: () => ApiServerInterface<Server, AppEnvironment>;
	restart(): Promise<boolean>;
	start(): Promise<boolean>;
	stop(): Promise<boolean>;
	isRunning(): boolean;
}

declare module 'fastify' {
	export interface FastifyRequest {
		access_token?: Record<string, any>;
	}
}
