/**
 * Downloads all data (topics, their associated data and the latest change) from
 * the API, reporting progress and status to gatsby.
 */

import { SourceNodesArgs } from "gatsby";
import { mapLimit, asyncify } from "async";

import {
	getAllPartialTopics,
	getChangesSince,
	getFullTopicCached,
} from "../api/api";

import {
	ApiTopicChangeResponse,
	ApiPartialTopic,
	ApiFullTopic,
	ApiTopicsResponse,
} from "../api/types";

interface DownloadResult {
	fullTopics: ApiFullTopic[];
	changes: ApiTopicChangeResponse;
}

const getAllFullTopics = async (
	{ topicCount, topics: partialTopics }: ApiTopicsResponse,
	{ cache, reporter: { createProgress } }: SourceNodesArgs
): Promise<ApiFullTopic[]> => {
	const topicDownloadProgress = createProgress(
		`Downloading ${topicCount} topics`,
		topicCount,
		0
	);
	topicDownloadProgress.start();

	// Load each full topic async in parallel but rate limited:
	// The API can't cope with firing them all off in parallel
	const fullTopics = await mapLimit<ApiPartialTopic, ApiFullTopic>(
		partialTopics,
		5,
		// Because we're transpiling an async function we need 'asyncify' it
		// see https://caolan.github.io/async/v3/docs.html#asyncify
		asyncify((partialTopic: ApiPartialTopic) => {
			const fullTopic = getFullTopicCached(partialTopic, cache);
			topicDownloadProgress.tick(1);
			return fullTopic;
		})
	);

	topicDownloadProgress.done();

	return fullTopics;
};

export const downloadAllData = async (
	sourceNodesArgs: SourceNodesArgs
): Promise<DownloadResult> => {
	const {
		reporter: { activityTimer },
	} = sourceNodesArgs;

	const apiActivity = activityTimer(`Downloading data from the API`);
	apiActivity.start();

	apiActivity.setStatus(`Downloading topics index`);
	const partialTopicsTask = getAllPartialTopics();

	apiActivity.setStatus(`Downloading monthly changes`);
	const whatsNewChangesTask = getChangesSince();

	const changes = await whatsNewChangesTask,
		fullTopics = await getAllFullTopics(
			await partialTopicsTask,
			sourceNodesArgs
		);

	apiActivity.setStatus(`Received all data from the API`);
	apiActivity.end();

	return {
		fullTopics,
		changes,
	};
};