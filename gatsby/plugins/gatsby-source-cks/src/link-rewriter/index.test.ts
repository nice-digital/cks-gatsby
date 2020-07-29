import { Reporter } from "gatsby";
import { replaceLinksInHtml } from ".";
import { NodeModel, RunQueryArgsFirst } from "./types";
import { ChapterNode } from "../node-creation/chapters";

describe("link rewriter", () => {
	const runQuery = jest.fn(),
		nodeModel: NodeModel = {
			getAllNodes: jest.fn(),
			getNodeById: jest.fn(),
			getNodesByIds: jest.fn(),
			runQuery,
		};

	const warn = jest.fn(),
		reporter = ({
			warn,
		} as unknown) as Reporter;

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("topic links", () => {
		it("should rewrite topic links", async () => {
			runQuery.mockImplementation((args: RunQueryArgsFirst) => {
				const topicId = (args.query.filter.topicId as { eq: string }).eq;
				switch (topicId) {
					case "e42fc175-7ae7-44c7-b7ef-b58a14733e7e":
						return {
							topicName: "Atrial fibrillation",
						};
					case "544c0dd8-12b4-472f-8325-25f15b3092e3":
						return {
							slug: "achilles-tendinopathy",
						};
					default:
						throw new Error(`Invalid topic id ${topicId}`);
				}
			});

			const result = await replaceLinksInHtml(
				{
					htmlStringContent: `<a href="/Topic/ViewTopic/544c0dd8-12b4-472f-8325-25f15b3092e3">Achilles tendinopathy</a>`,
					topic: "e42fc175-7ae7-44c7-b7ef-b58a14733e7e",
				} as ChapterNode,
				nodeModel,
				reporter
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/">Achilles tendinopathy</a>'
			);
		});

		it("should warn when topic guid not found", async () => {
			runQuery.mockImplementationOnce(() => ({
				topicName: "Atrial fibrillation",
			}));
			runQuery.mockImplementationOnce(() => null);
			expect.assertions(1);
			const htmlStringContent = `<a href="/Topic/ViewTopic/544c0dd8-12b4-472f-8325-25f15b3092e3">Achilles tendinopathy</a>`;
			await replaceLinksInHtml(
				{
					itemId: "123",
					fullItemName: "Topic not found link",
					htmlStringContent,
				} as ChapterNode,
				nodeModel,
				reporter
			);
			await expect(warn).toHaveBeenCalledWith(
				`Could not find topic '544c0dd8-12b4-472f-8325-25f15b3092e3'\n in link <a href="/Topic/ViewTopic/544c0dd8-12b4-472f-8325-25f15b3092e3">Achilles tendinopathy</a>\n in chapter 'Topic not found link' (123)\n in topic 'Atrial fibrillation'`
			);
		});
	});

	describe("chapter links", () => {
		it("should rewrite root chapter links", async () => {
			runQuery.mockImplementation((query) => {
				if (query.type === "CksTopic")
					return Promise.resolve({ slug: "achilles-tendinopathy" });
				if (query.type === "CksChapter")
					return Promise.resolve({ slug: "references" });
			});

			const result = await replaceLinksInHtml(
				{
					htmlStringContent: `<a href="#666cef38-2cdb-45b8-a427-aaffb3caa682">Achilles tendinopathy</a>`,
				} as ChapterNode,
				nodeModel,
				reporter
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/references/">Achilles tendinopathy</a>'
			);
		});

		it("should rewrite second level chapter links", async () => {
			runQuery.mockImplementation((query) => {
				if (query.type === "CksTopic")
					return Promise.resolve({ slug: "achilles-tendinopathy" });
				if (query.type === "CksChapter") {
					if (
						query.query.filter.itemId.eq ===
						"666cef38-2cdb-45b8-a427-aaffb3caa682"
					)
						return Promise.resolve({
							slug: "scenario",
							parentChapter: "123",
							rootChapter: "123",
						});

					return Promise.resolve({ slug: "management" });
				}
			});

			const result = await replaceLinksInHtml(
				{
					htmlStringContent: `<a href="#666cef38-2cdb-45b8-a427-aaffb3caa682">Achilles tendinopathy</a>`,
				} as ChapterNode,
				nodeModel,
				reporter
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/management/scenario/">Achilles tendinopathy</a>'
			);
		});

		it("should rewrite third level chapter links", async () => {
			runQuery.mockImplementation((query) => {
				if (query.type === "CksTopic")
					return Promise.resolve({ slug: "achilles-tendinopathy" });
				if (query.type === "CksChapter") {
					if (
						query.query.filter.itemId.eq ===
						"666cef38-2cdb-45b8-a427-aaffb3caa682"
					)
						return Promise.resolve({
							slug: "test",
							parentChapter: "123",
							rootChapter: "987",
						});
					else if (query.query.filter.itemId.eq === "123")
						return Promise.resolve({
							slug: "scenario",
						});

					return Promise.resolve({ slug: "management" });
				}
			});

			const result = await replaceLinksInHtml(
				{
					htmlStringContent: `<a href="#666cef38-2cdb-45b8-a427-aaffb3caa682">Achilles tendinopathy</a>`,
				} as ChapterNode,
				nodeModel,
				reporter
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/management/scenario/#test">Achilles tendinopathy</a>'
			);
		});
	});
});
