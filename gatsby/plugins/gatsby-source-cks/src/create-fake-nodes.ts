/* eslint-disable @typescript-eslint/camelcase */
import { SourceNodesArgs } from "gatsby";
import slugify from "slugify";

import { TopicNode, SpecialityNode, ChangeNode } from "./types";
import { NodeTypes } from "./constants";

const createFakeTopicNode = (
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
			// Generate a new guid for the actual node id, so people don't use it for querying
			id: createNodeId(topicId),
			internal: {
				type: NodeTypes.Topic,
				content: JSON.stringify(fullTopic),
				contentDigest: createContentDigest(fullTopic),
			},
		},
	};

	createNode(topicNode);
};

const createFakeSpecialityNode = (
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
			id: createNodeId(name),
			internal: {
				type: NodeTypes.Speciality,
				content: JSON.stringify(fullSpeciality),
				contentDigest: createContentDigest(fullSpeciality),
			},
		},
	};

	createNode(specialityNode);
};

const createFakeChangeNode = (
	title: string,
	text: string,
	topicId: string,
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { actions, createNodeId, createContentDigest } = sourceNodesArgs;
	const { createNode } = actions;

	const fullChange = {
		title,
		text,
		topic: topicId,
	};

	const changeNode: ChangeNode = {
		...fullChange,
		...{
			id: createNodeId(text),
			internal: {
				type: NodeTypes.Change,
				content: JSON.stringify(fullChange),
				contentDigest: createContentDigest(fullChange),
			},
		},
	};

	createNode(changeNode);
};

export const createFakeNodes = (sourceNodesArgs: SourceNodesArgs): void => {
	// Fake specialities
	createFakeSpecialityNode("Infections", ["abc123"], sourceNodesArgs);
	createFakeSpecialityNode("Cancer", ["abc123", "xyz789"], sourceNodesArgs);
	createFakeSpecialityNode("Skin and nail", ["xyz789"], sourceNodesArgs);

	// Fake "what's new" changes
	createFakeChangeNode(
		"New topic",
		"CKS topic written based on a literature search and on NICE rapid guidelines.",
		"abc123",
		sourceNodesArgs
	);
	createFakeChangeNode(
		"Reviewed",
		"A literature search was conducted in October 2019 ...",
		"xyz789",
		sourceNodesArgs
	);

	// Fake topics
	createFakeTopicNode(
		"abc123",
		"3rd Degree Sideburns",
		"Wistful longing for the 1970's",
		["Infections", "Cancer"],
		sourceNodesArgs
	);
	createFakeTopicNode(
		"xyz789",
		"Infectious Laughter",
		"Helpless chortling and repetition of unfunny catchphrases",
		["Cancer", "Skin and nail"],
		sourceNodesArgs
	);
	createFakeTopicNode(
		"def456",
		"Topic without specialiies",
		"Lorem ipsum dolor sit amet",
		[],
		sourceNodesArgs
	);
};
