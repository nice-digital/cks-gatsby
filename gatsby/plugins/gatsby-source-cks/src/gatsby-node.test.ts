import { createSchemaCustomization, sourceNodes } from "./gatsby-node";
import { CreateSchemaCustomizationArgs, SourceNodesArgs } from "gatsby";

import { downloadAllData } from "./downloader/downloader";
import { createTopicNodes } from "./node-creation/topics";
import { createSpecialityNodes } from "./node-creation/specialities";
import { createChangeNodes } from "./node-creation/changes";
import { createChapterNotes } from "./node-creation/chapters";

jest
	.mock("./downloader/downloader", () => ({
		downloadAllData: jest.fn().mockResolvedValue({}),
	}))
	.mock("./node-creation/topics", () => ({
		createTopicNodes: jest.fn(),
	}))
	.mock("./node-creation/specialities", () => ({
		createSpecialityNodes: jest.fn(),
	}))
	.mock("./node-creation/changes", () => ({
		createChangeNodes: jest.fn(),
	}))
	.mock("./node-creation/chapters", () => ({
		createChapterNotes: jest.fn(),
	}));

describe("gatsby-node", () => {
	describe("createSchemaCustomization", () => {
		it("should call createTypes with custom schema", () => {
			const createTypes = jest.fn();

			const args: unknown = {
				actions: { createTypes },
			};

			createSchemaCustomization(args as CreateSchemaCustomizationArgs);

			expect(createTypes).toHaveBeenCalledTimes(1);

			expect(createTypes.mock.calls[0][0]).toMatchSnapshot();
		});
	});

	describe("sourceNodes", () => {
		const sourceNodesArgs = ({
			reporter: {
				activityTimer: (): unknown => ({
					start: (): void => void 0,
					end: (): void => void 0,
					setStatus: (): void => void 0,
				}),
			},
		} as unknown) as SourceNodesArgs;

		const config = {
			apiBaseUrl: "t",
			apiKey: "b",
		};

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it("should download all data", async () => {
			await sourceNodes(sourceNodesArgs, config);

			expect(downloadAllData).toHaveBeenCalledTimes(1);
			expect(downloadAllData).toHaveBeenCalledWith(sourceNodesArgs);
		});

		it("should create all 4 types of nodes", async () => {
			(downloadAllData as jest.Mock).mockResolvedValueOnce({
				fullTopics: [{ a: 1 }],
				changes: [{ b: 2 }],
			});

			await sourceNodes(sourceNodesArgs, config);

			expect(createTopicNodes).toHaveBeenCalledTimes(1);
			expect(createTopicNodes).toHaveBeenCalledWith(
				[{ a: 1 }],
				sourceNodesArgs
			);
			expect(createSpecialityNodes).toHaveBeenCalledTimes(1);
			expect(createSpecialityNodes).toHaveBeenCalledWith(
				[{ a: 1 }],
				sourceNodesArgs
			);
			expect(createChangeNodes).toHaveBeenCalledTimes(1);
			expect(createChangeNodes).toHaveBeenCalledWith(
				[{ b: 2 }],
				sourceNodesArgs
			);
			expect(createChapterNotes).toHaveBeenCalledTimes(1);
			expect(createChapterNotes).toHaveBeenCalledWith(
				[{ a: 1 }],
				sourceNodesArgs
			);
		});
	});
});
