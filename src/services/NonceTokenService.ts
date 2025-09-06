import {
	ServiceProvider,
	IStoreService,
	TOrUndefined,
} from '@piggly/ddd-toolkit';
import { CryptoService } from '@piggly/ddd-toolkit/crypto';

/**
 * @file Nonce service.
 * @copyright Piggly Lab 2025
 * @since 7.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class NonceTokenService {
	/**
	 * Repository.
	 *
	 * @type {IStoreService}
	 * @protected
	 * @memberof NonceTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _repository: IStoreService;

	/**
	 * Constructor.
	 *
	 * @param {IStoreService} repository
	 * @public
	 * @constructor
	 * @memberof NonceTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(repository: IStoreService) {
		this._repository = repository;
	}

	/**
	 * Issue one or more nonces.
	 *
	 * @param {number} size
	 * @returns {Promise<Array<string>>}
	 * @throws {Error} If failed to issue nonce. Error may be produced by store service.
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async issue(
		size: number = 1,
		ttl: number = 3600,
	): Promise<Array<string>> {
		const nonces: Array<string> = [];

		for (let i = 0; i < size; i++) {
			const nonce = CryptoService.generateClientSecret(32);
			const response = await this._repository.set(
				`nonce:${nonce}`,
				'1',
				ttl,
			);

			if (response === false) {
				throw new Error('Failed to issue nonce');
			}

			nonces.push(nonce);
		}

		return nonces;
	}

	/**
	 * Verify a nonce.
	 *
	 * If will return undefined if nonce is not found
	 * or the same nonce if found. But, if regenerate
	 * is true, it will regenerate the nonce and return
	 * the new nonce.
	 *
	 * @param {string} nonce
	 * @param {boolean} regenerate
	 * @param {number} ttl
	 * @returns {Promise<TOrUndefined<string>>}
	 * @throws {Error} If failed to verify/regenerate nonce. Error may be produced by store service.
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async verify(
		nonce: string,
		regenerate?: boolean,
		ttl?: number,
	): Promise<TOrUndefined<string>> {
		const response = await this._repository.getAndDelete(`nonce:${nonce}`);

		if (!response) {
			return undefined;
		}

		if (regenerate === false) {
			return nonce;
		}

		const nonces = await this.issue(1, ttl);
		return nonces[0];
	}

	/**
	 * Register application service.
	 *
	 * @param {NonceTokenService} store
	 * @public
	 * @static
	 * @memberof NonceTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(store: IStoreService): void {
		if (ServiceProvider.has('NonceTokenService')) {
			return;
		}

		ServiceProvider.register(
			'NonceTokenService',
			new NonceTokenService(store),
		);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {NonceTokenService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof NonceTokenService
	 * @since 7.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): NonceTokenService {
		return ServiceProvider.resolve('NonceTokenService');
	}
}
