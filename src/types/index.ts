import { FastifyInstance, FastifyServerOptions } from 'fastify';
import moment from 'moment-timezone';
import BaseEntity from '@/entities/BaseEntity';

/** Globals */
export type TOrNull<T> = T | null;
export type TOrUndefined<T> = T | undefined;
export type TOrU<T, U> = T | U;
export type TOrFalse<T> = T | false;
export type TOrEmpty<T> = T | undefined | null;
export type TDateInput = number | string | Date | moment.Moment;
export type TObject = Record<string, any>;

/** Application Errors */

export interface PreviousErrorJSON {
	name: string;
	message: TOrNull<string>;
	stack?: TOrNull<string | PreviousErrorJSON>;
}

export interface ErrorJSON extends PreviousErrorJSON {
	code: number;
}

export interface ResponseErrorJSON extends ErrorJSON {
	status: number;
	body: Record<string, any>;
	hint: string;
}

export type PreviousError = TOrUndefined<
	TOrU<ApplicationErrorInterface, Error>
>;

export interface ApplicationErrorInterface extends Error {
	changeName: (name: string) => this;
	code: (code: number) => this;
	getCode: () => number;
	getMessage: () => string;
	getName: () => string;
	getPrevious: () => PreviousError;
	toJSON: () => Partial<ErrorJSON>;
	getPreviousJSON: () => TOrNull<PreviousErrorJSON>;
	toResponse: () => ResponseErrorInterface;
}

export interface ResponseErrorInterface extends ApplicationErrorInterface {
	hint: (hint: TOrUndefined<string>) => this;
	httpCode: (statusCode: number) => this;
	payload: (payload: Record<string, any>) => this;
	getHint: () => TOrUndefined<string>;
	getHttpCode: () => number;
	getPayload: () => object;
	toJSON: () => Partial<ResponseErrorJSON>;
}

/** Environment */

export type EnvironmentType = 'test' | 'development' | 'production';

export type DefaultEnvironment = {
	environment: EnvironmentType;
	name: string;
	port: number;
	host: string;
	debug: boolean;
	timezone: string;
	log_path: string;
};

export type EnvironmentAccessTokenOptions = {
	access_token: AccessTokenServiceOptions;
};

export type EnvironmentMysqlOptions = {
	mysql: {
		host: string;
		port: number;
		database: string;
		username: string;
		password: string;
	};
};

/** Fastify modifiers */

export type FastifyModifierCallable<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> = (app: App, env: AppEnvironment) => Promise<void>;

export interface FastifyAppliable<
	App = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> {
	apply: FastifyModifierCallable<App, AppEnvironment>;
}

/** Servers */

export type ApiServerOptions<
	Fastify = FastifyInstance,
	AppEnvironment = DefaultEnvironment
> = {
	routes: FastifyAppliable<Fastify, AppEnvironment>;
	plugins: FastifyAppliable<Fastify, AppEnvironment>;
	logger?: FastifyServerOptions['logger'];
	env: AppEnvironment;
	beforeInit?: FastifyModifierCallable<Fastify, AppEnvironment>;
	afterInit?: FastifyModifierCallable<Fastify, AppEnvironment>;
	errors: {
		notFound: ResponseErrorInterface;
		unknown: ResponseErrorInterface;
	};
};

export interface ApiServerInterface<Fastify, AppEnvironment> {
	getApp: () => Fastify;
	getEnv: () => AppEnvironment;
	bootstrap: () => Promise<HttpServerInterface<Fastify, AppEnvironment>>;
}

export interface HttpServerInterface<Fastify, AppEnvironment> {
	getApi: () => ApiServerInterface<Fastify, AppEnvironment>;
	start(): Promise<boolean>;
	restart(): Promise<boolean>;
	stop(): Promise<boolean>;
	isRunning(): boolean;
}

/** Validations */

export interface RuleInterface {
	assert(): void;
}

/** Core */

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface RepositoryInterface {}

/* eslint-disable-next-line @typescript-eslint/no-empty-interface */
export interface ServiceInterface {}

export interface AdapterInterface<Entity extends BaseEntity<any>, DTO> {
	toDTO(entity: Entity): DTO;
}

export interface FactoryInterface<
	Args extends any[],
	Entity extends BaseEntity<any>
> {
	create(...args: Args): Entity;
}

/** Repositories */

export type PaginateQuery = {
	page: number;
	size: number;
};

export type Filter = {
	[key: string]: any;
};

/** Services */

export interface ServiceManagerInterface {
	registerAsync<Service = any>(
		name: string,
		constructor: AsyncServiceConstructor<Service>
	): void;
	getAsync<Service = any>(name: string): Promise<Service>;
	registerSync<Service = any>(
		name: string,
		constructor: SyncServiceConstructor<Service>
	): void;
	getSync<Service = any>(name: string): Service;
	flushOnAsyncCache(name: string): void;
	flushOnSyncCache(name: string): void;
	clearCache(): void;
}

export type AsyncServiceConstructor<Service> = (
	manager: ServiceManagerInterface
) => Promise<Service>;

export type SyncServiceConstructor<Service> = (
	manager: ServiceManagerInterface
) => Service;

export type ServiceConstructor<Service> =
	| AsyncServiceConstructor<Service>
	| SyncServiceConstructor<Service>;

export type AccessTokenServiceOptions = {
	token_type: string;
	issuer?: string;
	audience?: string[];
	accept_issuer?: string;
	accept_audience?: string;
	ed25519: {
		public_key?: string;
		private_key?: string;
	};
	ttl?: number;
	required_claims?: string[];
};

/** Schemas */

export type SchemaHandler<ReturnEntry> = (entry: any) => ReturnEntry;

declare module 'fastify' {
	export interface FastifyRequest {
		access_token?: Record<string, any>;
	}
}
