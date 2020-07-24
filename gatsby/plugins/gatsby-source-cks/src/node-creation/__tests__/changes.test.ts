import { SourceNodesArgs } from "gatsby";

import { createChangeNodes } from "../changes";
import { ApiTopicChangeResponse } from "../../api/types";

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

	const changes = [
		{
			topicId: "topic1",
			topicName: "A topic name",
			title: "New topic",
			text: "Lorem ipsum",
		},
		{
			topicId: "topic2",
			topicName: "Another topic",
			title: "revised",
			text: "Dolor sit",
		},
	] as ApiTopicChangeResponse;

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should call createNode for each given change", () => {
		createChangeNodes(changes, sourceNodesArgs);
		expect(createNode).toHaveBeenCalledTimes(changes.length);
	});

	it("should create a unique node id from the topic id", () => {
		createNodeId.mockImplementation((s) => `node id: ` + s);
		createChangeNodes(changes, sourceNodesArgs);
		expect(createNodeId).toHaveBeenCalledTimes(changes.length);
		expect(createNodeId).toHaveBeenNthCalledWith(1, "Changetopic1");
		expect(createNodeId).toHaveBeenNthCalledWith(2, "Changetopic2");
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"id",
			"node id: Changetopic1"
		);
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"id",
			"node id: Changetopic2"
		);
	});

	it("should store topicId property on topic field", () => {
		createChangeNodes(changes, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("topic", "topic1");
		expect(createNode.mock.calls[1][0]).toHaveProperty("topic", "topic2");
	});

	it("should only store title and text fields", () => {
		createChangeNodes(changes, sourceNodesArgs);
		const { topicId, topicName, title, text } = createNode.mock.calls[0][0];
		expect(topicId).toBeUndefined();
		expect(topicName).toBeUndefined();
		expect(title).toEqual("New topic");
		expect(text).toEqual("Lorem ipsum");
	});

	it("should set contentDigest internal field using createContentDigest utility", () => {
		createContentDigest.mockImplementationOnce(
			(t) => `contentDigest: ${t.title}`
		);
		createChangeNodes(changes, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"internal.contentDigest",
			"contentDigest: New topic"
		);
	});
});
