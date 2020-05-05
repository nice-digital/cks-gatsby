import fetch from "node-fetch";
import moment from "moment";
import { Cache } from "gatsby";

import {
	ApiConfig,
	ApiTopicsResponse,
	ApiFullTopicResponse,
	ApiTopicChangeResponse,
	ApiPartialTopic,
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
	(await fetch(apiConfig.apiBaseUrl + path, {
		headers: {
			"ocp-apim-subscription-key": apiConfig.apiKey,
			Accept: "application/json",
		},
	}).then<TResponse>(r => r.json()));

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
 * Gets a full topic object from the /topic/id API endpoint.
 * Uncached version of `getFullTopicCached`
 *
 * @see getFullTopicCached
 */
const getFullTopic = async (
	partialTopic: ApiPartialTopic
): Promise<ApiFullTopicResponse> => ({
	// Merge the partial topic properties in with the full one
	...(await fetchJson<ApiFullTopicResponse>(partialTopic.currentVersionLink)),
	...partialTopic,
});

/**
 * Wrapper around the API method for retrieving a full topic.
 * Looks in the Gatsby cache for that version of the topic
 * before retrieving from the API.
 *
 * @see getFullTopic
 *
 * @returns A promise that resolves to a full topic
 */
export const getFullTopicCached = async (
	partialTopic: ApiPartialTopic,
	cache: Cache["cache"]
): Promise<ApiFullTopicResponse> => {
	const topicCacheKey = getTopicCacheKey(partialTopic);

	const cachedFullTopic = await (cache.get(
		topicCacheKey
	) as ApiFullTopicResponse | null);

	if (cachedFullTopic) return cachedFullTopic;

	const apiFullTopic = await getFullTopic(partialTopic);

	await cache.set(topicCacheKey, apiFullTopic);

	return apiFullTopic;
};

/**
 * Gets changes to topics from the API since the given date.
 * Leave date empty to default to the first day of the previous month.
 *
 * @returns A promise that resolves to a list of topic updates
 */
export const getChangesSince = (
	date: Date = moment()
		.utc()
		.subtract(1, "months")
		.startOf("month")
		.toDate()
): Promise<ApiTopicChangeResponse> =>
	fetchJson<ApiTopicChangeResponse>("/changes-since/" + date.toISOString());
