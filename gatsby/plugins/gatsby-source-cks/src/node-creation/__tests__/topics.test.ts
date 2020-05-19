import { createTopicNodes } from "../topics";
import { SourceNodesArgs } from "gatsby";
import { ApiFullTopic, ApiTopicHtmlObject } from "../../api/types";

describe("createTopicNodes", () => {
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
			topicName: "A topic name",
			topicSummary: "A topic summary",
			clinicalSpecialties: ["Injuries", "Musculoskeletal"],
			topicHtmlObjects: [
				{
					itemId: "chapter1",
				} as ApiTopicHtmlObject,
			],
		} as ApiFullTopic,
		{
			topicId: "topic2",
			topicName: "A second topic",
			topicHtmlObjects: [] as ApiTopicHtmlObject[],
		} as ApiFullTopic,
	];

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should call createNode for each given topic", () => {
		createTopicNodes(topics, sourceNodesArgs);
		expect(createNode).toHaveBeenCalledTimes(topics.length);
	});

	it("should slugify the lowercased topic title", () => {
		createTopicNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("slug", "a-topic-name");
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"slug",
			"a-second-topic"
		);
	});

	it("should create a node id from the topic id", () => {
		createNodeId.mockImplementation(s => `node id: ` + s);
		createTopicNodes(topics, sourceNodesArgs);
		expect(createNodeId).toHaveBeenCalledTimes(topics.length);
		expect(createNodeId).toHaveBeenNthCalledWith(1, "topic1");
		expect(createNodeId).toHaveBeenNthCalledWith(2, "topic2");
		expect(createNode.mock.calls[0][0]).toHaveProperty("id", "node id: topic1");
		expect(createNode.mock.calls[1][0]).toHaveProperty("id", "node id: topic2");
	});

	it("should store all fields on node except clinicalSpecialties and topicHtmlObjects", () => {
		createTopicNodes(topics, sourceNodesArgs);
		const {
			topicId,
			clinicalSpecialties,
			topicHtmlObjects,
		} = createNode.mock.calls[0][0];
		expect(topicId).toBe("topic1");
		expect(clinicalSpecialties).toBeUndefined();
		expect(topicHtmlObjects).toBeUndefined();
	});

	it("should store topicHtmlObjects item ids in the chapters field", () => {
		createTopicNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("chapters", [
			"chapter1",
		]);
	});

	it("should store clinicalSpecialties in the specialities field", () => {
		createTopicNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("specialities", [
			"Injuries",
			"Musculoskeletal",
		]);
	});

	it("should set contentDigest internal field using createContentDigest utility", () => {
		createContentDigest.mockImplementation(t => `contentDigest: ${t.topicId}`);
		createTopicNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"internal.contentDigest",
			"contentDigest: topic1"
		);
	});
});
