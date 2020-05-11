import { SourceNodesArgs } from "gatsby";
import slugify from "slugify";

import { TopicNode, SpecialityNode, ChangeNode, ChapterNode } from "./types";
import {
	topicNodeType,
	specialityNodeType,
	changeNodeType,
	chapterNodeType,
} from "./node-types";

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
				type: topicNodeType,
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
				type: specialityNodeType,
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
				type: changeNodeType,
				content: JSON.stringify(fullChange),
				contentDigest: createContentDigest(fullChange),
			},
		},
	};

	createNode(changeNode);
};

const createFakeChapter = (
	itemId: string,
	parentId: string | null,
	rootId: string,
	fullItemName: string,
	htmlHeader: string,
	htmlStringContent: string,
	containerElement: string,
	depth: number,
	pos: number,
	topicId: string,
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { actions, createNodeId, createContentDigest } = sourceNodesArgs;
	const { createNode } = actions;

	const slug = slugify(fullItemName, { lower: true });

	const fullChapter = {
		itemId,
		slug,
		parentChapter: parentId,
		rootChapter: rootId,
		fullItemName,
		htmlHeader,
		htmlStringContent,
		containerElement,
		depth,
		pos,
		subChapters: [],
		topic: topicId,
	};

	const chapterNode: ChapterNode = {
		...fullChapter,
		...{
			id: createNodeId(itemId),
			internal: {
				type: chapterNodeType,
				content: JSON.stringify(fullChapter),
				contentDigest: createContentDigest(fullChapter),
			},
		},
	};

	createNode(chapterNode);
};

export const createFakeNodes = (sourceNodesArgs: SourceNodesArgs): void => {
	// Fake specialities
	createFakeSpecialityNode("Infections", ["topic1"], sourceNodesArgs);
	createFakeSpecialityNode("Cancer", ["topic1", "topic2"], sourceNodesArgs);
	createFakeSpecialityNode("Skin and nail", ["topic2"], sourceNodesArgs);

	// Fake "what's new" changes
	createFakeChangeNode(
		"New topic",
		"CKS topic written based on a literature search and on NICE rapid guidelines.",
		"topic1",
		sourceNodesArgs
	);
	createFakeChangeNode(
		"Reviewed",
		"A literature search was conducted in October 2019 ...",
		"topic2",
		sourceNodesArgs
	);

	// Fake topics
	createFakeTopicNode(
		"topic1",
		"3rd Degree Sideburns",
		"Wistful longing for the 1970's",
		["Infections", "Cancer"],
		sourceNodesArgs
	);
	createFakeTopicNode(
		"topic2",
		"Infectious Laughter",
		"Helpless chortling and repetition of unfunny catchphrases",
		["Cancer", "Skin and nail"],
		sourceNodesArgs
	);
	createFakeTopicNode(
		"topic3",
		"Topic without specialiies",
		"Lorem ipsum dolor sit amet",
		[],
		sourceNodesArgs
	);

	// Fake chapters
	createFakeChapter(
		"chapter1",
		null,
		"chapter1",
		"Summary",
		"<h1>Topic 1: summary</h1>",
		"<p>test topic.</p>",
		"topicSummary",
		1,
		0,
		"topic1",
		sourceNodesArgs
	);
	createFakeChapter(
		"chapter2",
		null,
		"chapter2",
		"Have I got the right topic?",
		"<h1>Have I got the right topic?</h1>",
		"<p>From birth onwards.</p>",
		"rightTopic",
		1,
		1,
		"topic1",
		sourceNodesArgs
	);
};
