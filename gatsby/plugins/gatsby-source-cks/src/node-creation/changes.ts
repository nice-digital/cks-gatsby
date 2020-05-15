/**
 * Creates Gatsby GraphQL nodes for monthly changes (for the what's new page) from downloaded data
 */

import { NodeInput, SourceNodesArgs } from "gatsby";
import { ApiTopicChangeResponse } from "../api/types";

export const changeNodeType = "CksChange";

export interface ChangeNode extends NodeInput {
	title: string;
	text: string;
	// Foreign keys
	topic: string;
	internal: {
		type: typeof changeNodeType;
	} & NodeInput["internal"];
}

export const createChangeNodes = (
	changes: ApiTopicChangeResponse,
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { createNodeId, createContentDigest, actions } = sourceNodesArgs;
	const { createNode } = actions;

	changes.forEach(({ topicId, title, text }) => {
		const nodeContent = {
			title,
			text,
			topic: topicId,
		};

		const changeNode: ChangeNode = {
			...nodeContent,
			id: createNodeId(`Change${topicId}`),
			children: [],
			internal: {
				type: changeNodeType,
				content: JSON.stringify(nodeContent),
				contentDigest: createContentDigest(nodeContent),
			},
		};

		createNode(changeNode);
	});
};
