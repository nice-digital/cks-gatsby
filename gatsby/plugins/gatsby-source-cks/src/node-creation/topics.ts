/**
 * Creates Gatsby GraphQL nodes for topics from downloaded data
 */

import { SourceNodesArgs, NodeInput } from "gatsby";
import slugify from "slugify";

import { ApiSingleTopicResponse, ApiFullTopic } from "../api/types";

export const topicNodeType = "CksTopic";

export interface TopicNode
	extends NodeInput,
		Omit<ApiSingleTopicResponse, "clinicalSpecialties" | "topicHtmlObjects"> {
	slug: string;
	// Foreign keys
	specialities: string[];
	chapters: string[];
	// Internal Gatsby node stuff
	internal: {
		type: typeof topicNodeType;
	} & NodeInput["internal"];
}

export const createTopicNodes = (
	topics: ApiFullTopic[],
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { createNodeId, createContentDigest, actions } = sourceNodesArgs;
	const { createNode } = actions;

	topics.forEach(
		({ topicHtmlObjects, clinicalSpecialties, ...topic }: ApiFullTopic) => {
			const { topicId, topicName } = topic;

			const nodeContent = {
				...topic,
				...{
					slug: slugify(topicName, { lower: true, remove: /[(),']/g }),
					specialities: clinicalSpecialties,
					chapters: topicHtmlObjects.map((t) => t.itemId),
				},
			};

			const topicNode: TopicNode = {
				...nodeContent,
				id: createNodeId(topicId),
				children: [],
				internal: {
					type: topicNodeType,
					content: JSON.stringify(nodeContent),
					contentDigest: createContentDigest(nodeContent),
				},
			};

			createNode(topicNode);
		}
	);
};
