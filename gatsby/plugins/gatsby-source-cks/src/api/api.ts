/**
 * Low-level methods to access each of the CKS API endpoints
 *
 * @module
 */

import fetch from "node-fetch";
import { Cache } from "gatsby";

import {
	ApiConfig,
	ApiTopicsResponse,
	ApiSingleTopicResponse,
	ApiTopicChangeResponse,
	ApiPartialTopic,
	ApiFullTopic,
} from "./types";

export const apiConfig: ApiConfig = {
	apiBaseUrl: "",
	apiKey: "",
};

export const configure = ({ apiBaseUrl, apiKey }: ApiConfig): void => {
	apiConfig.apiBaseUrl = apiBaseUrl;
	apiConfig.apiKey = apiKey;
};

const verifyConfig = (): true => {
	if (
		!apiConfig.apiBaseUrl ||
		apiConfig.apiBaseUrl === "" ||
		!apiConfig.apiKey ||
		apiConfig.apiKey === ""
	)
		throw new Error(
			"Please call configure with a base url and key before using the API."
		);

	return true;
};

/**
 * Wrapper function around fetch that addds headers for
 * authentication and JSON accept content type
 */
const fetchJson = async <TResponse>(path: string): Promise<TResponse> =>
	verifyConfig() &&
	(
		await fetch(apiConfig.apiBaseUrl + path, {
			headers: {
				"ocp-apim-subscription-key": apiConfig.apiKey,
				Accept: "application/json",
			},
		})
	).json();

/**
 * Retrieves a list of all of the partial topics from the /topics API endpoint.
 *
 * @returns {Promise} A promise that resolves to an array of partial topics
 */
export const getAllPartialTopics = (): Promise<ApiTopicsResponse> =>
	fetchJson("/topics");

/**
 * Gets a unique cache key for this version of the topic
 */
export const getTopicCacheKey = (partialTopic: ApiPartialTopic): string =>
	`${partialTopic.id}_${partialTopic.currentVersion}`;

/**
 * Gets a single topic object from the /topic/id API endpoint.
 *
 * @see getFullTopicCached
 */
const getSingleTopic = async (
	partialTopic: ApiPartialTopic
): Promise<ApiSingleTopicResponse> =>
	fetchJson(partialTopic.currentVersionLink);

/**
 * Wrapper around the API method for retrieving a full topic.
 * Looks in the Gatsby cache for that version of the topic
 * before retrieving from the API.
 *
 * @see getSingleTopic
 *
 * @returns A promise that resolves to a full topic
 */
export const getFullTopicCached = async (
	partialTopic: ApiPartialTopic,
	cache: Cache["cache"]
): Promise<ApiFullTopic> => {
	const topicCacheKey = getTopicCacheKey(partialTopic);

	const cachedFullTopic = (await cache.get(
		topicCacheKey
	)) as ApiFullTopic | null;

	if (cachedFullTopic) return cachedFullTopic;

	const apiFullTopic: ApiFullTopic = {
		// Merge the partial topic properties in with the full one:
		// there are a few properties on a partial topic the full one doesn't have
		...(await getSingleTopic(partialTopic)),
		...partialTopic,
	};

	await cache.set(topicCacheKey, apiFullTopic);

	return apiFullTopic;
};

/**
 * Gets changes to topics from the API since the given date.
 *
 * @returns A promise that resolves to a list of topic changes
 */
export const getChangesSince = (date: Date): Promise<ApiTopicChangeResponse> =>
	fetchJson("/changes-since/" + date.toISOString());
