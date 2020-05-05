export interface ConfigOptions {
	/** The API base URL */
	apiBaseUrl: string;
	/** The api key for authentication via a request header */
	apiKey: string;
	/**
	 *
	 *
	 * @type {Date}
	 * @memberof ConfigOptions
	 */
	changesSinceDate?: Date;
}
