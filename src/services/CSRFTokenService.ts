import crypto from 'node:crypto';

import type { FastifyRequest, FastifyReply } from 'fastify';

import type {
	CookieBuilderService,
	CookieOptions,
} from '@/services/CookieBuilderService.js';

import { getHeaderValue } from '@/utils/index.js';

/**
 * @file CSRF token service.
 * @copyright Piggly Lab 2025
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class CSRFTokenService {
	/**
	 * Cookie.
	 *
	 * @type {CookieBuilderService}
	 * @protected
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _cookie: CookieBuilderService;

	/**
	 * Secret.
	 *
	 * @type {string}
	 * @protected
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _secret: string;

	/**
	 * Constructor.
	 *
	 * @param {CookieBuilderService} cookie
	 * @param {string} secret
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(cookie: CookieBuilderService, secret: string) {
		this._cookie = cookie;
		this._secret = secret;
	}

	/**
	 * Set the CSRF token as a cookie.
	 *
	 * @param {FastifyReply} reply
	 * @param {string} name
	 * @param {CookieOptions} options
	 * @returns {FastifyReply}
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public asCookie<T extends FastifyReply>(
		reply: T,
		name: string = 'csrf_token',
		options?: CookieOptions,
	): T {
		const token = this.asRaw();
		this._cookie.set(reply, name, token, options);

		return reply;
	}

	/**
	 * Set the CSRF token as a header.
	 *
	 * @param {FastifyReply} reply
	 * @param {string} header
	 * @returns {FastifyReply}
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public asHeader<T extends FastifyReply>(
		reply: T,
		header: string = 'X-Csrf-Token',
	): T {
		const token = this.asRaw();
		reply.header(header, token);

		return reply;
	}

	/**
	 * Generate a CSRF token.
	 *
	 * It will be generated following the format:
	 * <token>.<signature>
	 *
	 * @returns {string}
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public asRaw(): string {
		const token = CSRFTokenService.generateClientSecret(32);
		const signature = CSRFTokenService.sign(token, this._secret);

		return `${token}.${signature}`;
	}

	/**
	 * Verify a CSRF token.
	 *
	 * @param {string} token
	 * @returns {boolean}
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public verify(token?: string): boolean {
		if (!token) {
			return false;
		}

		const [_token = '', _signature = ''] = String(token).split('.');
		return CSRFTokenService.verify(_token, _signature, this._secret);
	}

	/**
	 * Verify a CSRF token from a cookie.
	 *
	 * @param {FastifyRequest} request
	 * @param {string} cookie
	 * @returns {boolean}
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public verifyCookie<T extends FastifyRequest>(
		request: T,
		cookie: string = 'csrf_token',
	): boolean {
		const token = this._cookie.get(request, cookie, '');
		return this.verify(token!);
	}

	/**
	 * Verify a CSRF token from a header.
	 *
	 * @param {FastifyRequest} request
	 * @param {string} header
	 * @returns {boolean}
	 * @memberof CSRFTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public verifyHeader<T extends FastifyRequest>(
		request: T,
		header: string = 'X-Csrf-Token',
	): boolean {
		const token = getHeaderValue(request, header);
		return this.verify(token);
	}

	/**
	 * Random generates a client secret.
	 *
	 * @param {number} [size=36]
	 * @public
	 * @static
	 * @memberof CSRFTokenService
	 * @since 7.6.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected static generateClientSecret(size: number = 36): string {
		const buffer = crypto.randomBytes(size);

		return buffer
			.toString('base64')
			.replace(/\//g, '_')
			.replace(/\+/g, '-')
			.replace(/=/g, '');
	}

	/**
	 * Sign a string with a specific key HMAC sha256.
	 *
	 * @param {string} data
	 * @param {string} key
	 * @public
	 * @static
	 * @memberof CSRFTokenService
	 * @since 7.6.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected static sign(data: string, key: string): string {
		return crypto.createHmac('sha256', key).update(data).digest('hex');
	}

	/**
	 * Verify a string with a specific key HMAC sha256.
	 *
	 * @param {string} data
	 * @param {string} key
	 * @param {string} signature
	 * @public
	 * @static
	 * @memberof CSRFTokenService
	 * @since 7.6.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected static verify(
		data: string,
		signature: string,
		key: string,
		onError?: (err: any) => void,
	): boolean {
		try {
			const generatedSignature = CSRFTokenService.sign(data, key);

			return crypto.timingSafeEqual(
				Buffer.from(generatedSignature, 'hex'),
				Buffer.from(signature, 'hex'),
			);
		} catch (err) {
			if (onError) {
				onError(err);
			}

			return false;
		}
	}
}
