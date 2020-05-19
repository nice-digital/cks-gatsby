import { SourceNodesArgs } from "gatsby";

import { createChapterNotes } from "../chapters";
import { ApiFullTopic, ApiTopicHtmlObject } from "../../api/types";

describe("createChangeNodes", () => {
	const createNodeId = jest.fn(),
		createContentDigest = jest.fn(),
		createNode = jest.fn();

	const sourceNodesArgs: SourceNodesArgs = ({
		createNodeId,
		createContentDigest,
		actions: {
			createNode,
		},
	} as unknown) as SourceNodesArgs;

	const topics = [
		{
			topicId: "topic1",
			topicHtmlObjects: [
				{
					itemId: "chapter1",
					fullItemName: "Chapter 1",
					containerElement: "topicSummary",
					parentId: null,
					rootId: "chapter1",
					children: [
						{
							rootId: "chapter1",
							parentId: "chapter1",
							itemId: "chapter1.1",
							fullItemName: "Chapter 1.1",
							containerElement: "rightTopic",
							children: [] as ApiTopicHtmlObject[],
						} as ApiTopicHtmlObject,
					],
				} as ApiTopicHtmlObject,
			],
		} as ApiFullTopic,
		{
			topicId: "topic2",
			topicName: "A second topic",
			topicHtmlObjects: [
				{
					itemId: "chapter2",
					rootId: "chapter2",
					parentId: null,
					fullItemName: "Chapter 2",
					containerElement: "annualKnowNewEvidence",
					children: [] as ApiTopicHtmlObject[],
				} as ApiTopicHtmlObject,
			],
		} as ApiFullTopic,
	];

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should call createNode for each nested chapters", () => {
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode).toHaveBeenCalledTimes(3);
	});

	it("should store slugified lowercased name in slug field", () => {
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("slug", "topic-summary");
		expect(createNode.mock.calls[1][0]).toHaveProperty("slug", "right-topic");
	});

	it("should create a unique node id from the itemId property", () => {
		createNodeId.mockImplementation(s => `node id: ` + s);
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNodeId).toHaveBeenCalledTimes(3);
		expect(createNodeId).toHaveBeenNthCalledWith(1, "chapter1");
		expect(createNodeId).toHaveBeenNthCalledWith(2, "chapter1.1");
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"id",
			"node id: chapter1"
		);
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"id",
			"node id: chapter1.1"
		);
	});

	it("should use parent topic id in topic field", () => {
		createChapterNotes(topics, sourceNodesArgs);
		const calls = createNode.mock.calls;
		expect(calls[0][0]).not.toHaveProperty("topicId");
		expect(calls[0][0]).toHaveProperty("topic", "topic1");
		expect(calls[1][0]).not.toHaveProperty("topicId");
		expect(calls[1][0]).toHaveProperty("topic", "topic1");
	});

	it("should set child topics in subChapters field", () => {
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("subChapters", [
			"chapter1.1",
		]);
	});

	it("should have empty parent chapter for the root chapter", () => {
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0].parentChapter).toBeNull();
	});

	it("should reference itself for root chapter's root", () => {
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"rootChapter",
			"chapter1"
		);
	});

	it("should set parent and root chapter fields for sub chapters", () => {
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"rootChapter",
			"chapter1"
		);
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"parentChapter",
			"chapter1"
		);
	});

	it("should set contentDigest internal field using createContentDigest utility", () => {
		createContentDigest.mockImplementationOnce(
			t => `contentDigest: ${t.fullItemName}`
		);
		createChapterNotes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"internal.contentDigest",
			"contentDigest: Chapter 1"
		);
	});
});
