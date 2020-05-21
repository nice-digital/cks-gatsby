import { SourceNodesArgs } from "gatsby";

import { createSpecialityNodes } from "../specialities";
import { ApiFullTopic } from "../../api/types";

describe("createSpecialityNodes", () => {
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

	const injuries = "Injuries",
		musculoskeletal = "Musculoskeletal",
		infections = "Infections and infestations";

	const topics = [
		{
			topicId: "topic1",
			clinicalSpecialties: [injuries, musculoskeletal],
		} as ApiFullTopic,
		{
			topicId: "topic2",
			clinicalSpecialties: [injuries, infections],
		} as ApiFullTopic,
		{
			topicId: "topic3",
			clinicalSpecialties: [infections],
		} as ApiFullTopic,
	];

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should call createNode for each speciality", () => {
		createSpecialityNodes(topics, sourceNodesArgs);
		expect(createNode).toHaveBeenCalledTimes(3);
	});

	it("should store speciality name", () => {
		createSpecialityNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("name", "Injuries");
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"name",
			"Musculoskeletal"
		);
		expect(createNode.mock.calls[2][0]).toHaveProperty(
			"name",
			"Infections and infestations"
		);
	});

	it("should store slugified lowercased name in slug field", () => {
		createSpecialityNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("slug", "injuries");
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"slug",
			"musculoskeletal"
		);
		expect(createNode.mock.calls[2][0]).toHaveProperty(
			"slug",
			"infections-and-infestations"
		);
	});

	it("should create a unique node id from the speciality name", () => {
		createNodeId.mockImplementation(s => `node id: ` + s);
		createSpecialityNodes(topics, sourceNodesArgs);
		expect(createNodeId).toHaveBeenCalledTimes(3);
		expect(createNodeId).toHaveBeenNthCalledWith(1, "Injuries");
		expect(createNodeId).toHaveBeenNthCalledWith(2, "Musculoskeletal");
		expect(createNodeId).toHaveBeenNthCalledWith(
			3,
			"Infections and infestations"
		);
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"id",
			"node id: Injuries"
		);
		expect(createNode.mock.calls[1][0]).toHaveProperty(
			"id",
			"node id: Musculoskeletal"
		);
		expect(createNode.mock.calls[2][0]).toHaveProperty(
			"id",
			"node id: Infections and infestations"
		);
	});

	it("should store topicIds in topics field", () => {
		createSpecialityNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty("topics", [
			"topic1",
			"topic2",
		]);
		expect(createNode.mock.calls[1][0]).toHaveProperty("topics", ["topic1"]);
		expect(createNode.mock.calls[2][0]).toHaveProperty("topics", [
			"topic2",
			"topic3",
		]);
	});

	it("should set contentDigest internal field using createContentDigest utility", () => {
		createContentDigest.mockImplementationOnce(t => `contentDigest: ${t.name}`);
		createSpecialityNodes(topics, sourceNodesArgs);
		expect(createNode.mock.calls[0][0]).toHaveProperty(
			"internal.contentDigest",
			"contentDigest: Injuries"
		);
	});
});