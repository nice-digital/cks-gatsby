import { SourceNodesArgs, CreateSchemaCustomizationArgs } from "gatsby";
import slugify from "slugify";

import { schema } from "./schema";
import { TopicNode } from "./types";
import { NodeTypes, NodeIdPrefixes } from "./constants";

export const createSchemaCustomization = ({
	actions: { createTypes },
}: CreateSchemaCustomizationArgs): void => {
	createTypes(schema);
};

const createTopicNode = (
	topicId: string,
	topicName: string,
	topicSummary: string,
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { actions, createNodeId, createContentDigest } = sourceNodesArgs;
	const { createNode } = actions;

	const slug = slugify(topicName, { lower: true });

	const fullTopic = {
		topicId,
		topicName,
		topicSummary,
		slug,
	};

	const topicNode: TopicNode = {
		...fullTopic,
		...{
			id: createNodeId(NodeIdPrefixes.Topic + topicId),
			children: [],
			internal: {
				type: NodeTypes.Topic,
				content: JSON.stringify(fullTopic),
				contentDigest: createContentDigest(fullTopic),
			},
		},
	};

	createNode(topicNode);
};

export const sourceNodes = async (
	sourceNodesArgs: SourceNodesArgs
): Promise<undefined> => {
	const { reporter } = sourceNodesArgs;

	const activity = reporter.activityTimer(`Creating nodes`);
	activity.start();

	createTopicNode(
		"abc123",
		"3rd Degree Sideburns",
		"Wistful longing for the 1970's",
		sourceNodesArgs
	);

	createTopicNode(
		"xyz789",
		"Infectious Laughter",
		"Helpless chortling and repetition of unfunny catchphrases",
		sourceNodesArgs
	);

	activity.setStatus(`Created nodes`);
	activity.end();

	return;
};
