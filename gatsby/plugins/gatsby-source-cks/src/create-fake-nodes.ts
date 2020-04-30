/* eslint-disable @typescript-eslint/camelcase */
import { SourceNodesArgs } from "gatsby";
import slugify from "slugify";

import { TopicNode, SpecialityNode } from "./types";
import { NodeTypes, NodeIdPrefixes } from "./constants";

const createTopicNode = (
	topicId: string,
	topicName: string,
	topicSummary: string,
	specialityNames: string[],
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
		lastRevised: "A date",
		nextPlannedReviewBy: "2020-10-18",
		specialities: specialityNames,
		chapters: [],
		latestChanges: [],
		terms: [],
	};

	const topicNode: TopicNode = {
		...fullTopic,
		...{
			id: createNodeId(NodeIdPrefixes.Topic + topicId),
			internal: {
				type: NodeTypes.Topic,
				content: JSON.stringify(fullTopic),
				contentDigest: createContentDigest(fullTopic),
			},
		},
	};

	createNode(topicNode);
};

const createSpecialityNode = (
	name: string,
	topicIds: string[],
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { actions, createNodeId, createContentDigest } = sourceNodesArgs;
	const { createNode } = actions;

	const slug = slugify(name, { lower: true });

	const fullSpeciality = {
		name,
		slug,
		topics: topicIds,
	};

	const specialityNode: SpecialityNode = {
		...fullSpeciality,
		...{
			id: createNodeId(NodeIdPrefixes.Speciality + name),
			internal: {
				type: NodeTypes.Speciality,
				content: JSON.stringify(fullSpeciality),
				contentDigest: createContentDigest(fullSpeciality),
			},
		},
	};

	createNode(specialityNode);
};

export const createFakeNodes = (sourceNodesArgs: SourceNodesArgs): void => {
	createSpecialityNode("Infections", ["abc123"], sourceNodesArgs);
	createSpecialityNode("Cancer", ["abc123", "xyz789"], sourceNodesArgs);
	createSpecialityNode("Skin and nail", ["xyz789"], sourceNodesArgs);

	createTopicNode(
		"abc123",
		"3rd Degree Sideburns",
		"Wistful longing for the 1970's",
		["Infections", "Cancer"],
		sourceNodesArgs
	);

	createTopicNode(
		"xyz789",
		"Infectious Laughter",
		"Helpless chortling and repetition of unfunny catchphrases",
		["Cancer", "Skin and nail"],
		sourceNodesArgs
	);
	createTopicNode(
		"def456",
		"Topic without specialiies",
		"Lorem ipsum dolor sit amet",
		[],
		sourceNodesArgs
	);
};
