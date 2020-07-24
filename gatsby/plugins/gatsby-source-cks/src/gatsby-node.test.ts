import {
	createSchemaCustomization,
	sourceNodes,
	createResolvers,
} from "./gatsby-node";
import {
	CreateSchemaCustomizationArgs,
	SourceNodesArgs,
	CreateResolversArgs,
} from "gatsby";

import { downloadAllData } from "./downloader/downloader";
import { createTopicNodes } from "./node-creation/topics";
import { createSpecialityNodes } from "./node-creation/specialities";
import { createChangeNodes } from "./node-creation/changes";
import { createChapterNotes } from "./node-creation/chapters";
import { replaceLinksInHtml } from "./link-rewriter";

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
	}))
	.mock("./link-rewriter", () => ({
		replaceLinksInHtml: jest.fn(),
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
				info: (): void => void 0,
			},
		} as unknown) as SourceNodesArgs;

		const config = {
			apiBaseUrl: "t",
			apiKey: "b",
			changesSinceDate: new Date(2020, 0, 12),
		};

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it("should download all data", async () => {
			await sourceNodes(sourceNodesArgs, config);

			expect(downloadAllData).toHaveBeenCalledTimes(1);
			expect(downloadAllData).toHaveBeenCalledWith(
				sourceNodesArgs,
				config.changesSinceDate
			);
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

	describe("createResolvers", () => {
		it("should create a resolver for Chapter htmlStringContent property", () => {
			const createResolversFn = jest.fn();

			createResolvers({
				createResolvers: createResolversFn as unknown,
			} as CreateResolversArgs);

			expect(createResolversFn).toHaveBeenCalledTimes(1);
			expect(createResolversFn).toHaveBeenCalledWith({
				CksChapter: { htmlStringContent: { resolve: expect.any(Function) } },
			});
		});

		it("should create resolver that calls replaceLinksInHtml with chapter and node model", async () => {
			const createResolversFn = jest.fn();

			createResolvers({
				createResolvers: createResolversFn as unknown,
			} as CreateResolversArgs);

			const chapter = { slug: "test" };
			const resolveContext = { nodeModel: { runQuery: jest.fn() } };

			await createResolversFn.mock.calls[0][0].CksChapter.htmlStringContent.resolve(
				chapter,
				{},
				resolveContext
			);

			expect(replaceLinksInHtml).toHaveBeenCalledWith(
				chapter,
				resolveContext.nodeModel
			);
		});
	});
});
