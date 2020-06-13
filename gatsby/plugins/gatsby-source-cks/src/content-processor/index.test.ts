import { replaceLinksInHtml } from "./";
import { NodeModel } from "./types";
import { ChapterNode } from "../node-creation/chapters";

describe("content processor", () => {
	const runQuery = jest.fn(),
		nodeModel: NodeModel = {
			getAllNodes: jest.fn(),
			getNodeById: jest.fn(),
			getNodesByIds: jest.fn(),
			runQuery,
		};

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("topic links", () => {
		it("should rewrite topic links", async () => {
			runQuery.mockResolvedValueOnce({
				slug: "achilles-tendinopathy",
			});

			const result = await replaceLinksInHtml(
				{
					htmlStringContent: `<a href="/Topic/ViewTopic/544c0dd8-12b4-472f-8325-25f15b3092e3">Achilles tendinopathy</a>`,
				} as ChapterNode,
				nodeModel
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/">Achilles tendinopathy</a>'
			);
		});

		it("should throw error when topic guid not found", async () => {
			runQuery.mockImplementationOnce(() => null);
			expect.assertions(1);
			const htmlStringContent = `<a href="/Topic/ViewTopic/544c0dd8-12b4-472f-8325-25f15b3092e3">Achilles tendinopathy</a>`;
			await expect(
				replaceLinksInHtml(
					{
						itemId: "123",
						fullItemName: "Topic not found link",
						htmlStringContent,
					} as ChapterNode,
					nodeModel
				)
			).rejects.toMatchObject({
				message: `Could not find topic '544c0dd8-12b4-472f-8325-25f15b3092e3' in <a href="/Topic/ViewTopic/544c0dd8-12b4-472f-8325-25f15b3092e3">Achilles tendinopathy</a> for chapter 'Topic not found link' (123)`,
			});
		});
	});

	describe("chapter links", () => {
		it("should rewrite root chapter links", async () => {
			runQuery.mockImplementation(query => {
				if (query.type === "CksTopic")
					return Promise.resolve({ slug: "achilles-tendinopathy" });
				if (query.type === "CksChapter")
					return Promise.resolve({ slug: "references" });
			});

			const result = await replaceLinksInHtml(
				{
					htmlStringContent: `<a href="#666cef38-2cdb-45b8-a427-aaffb3caa682">Achilles tendinopathy</a>`,
				} as ChapterNode,
				nodeModel
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/references/">Achilles tendinopathy</a>'
			);
		});

		it("should rewrite second level chapter links", async () => {
			runQuery.mockImplementation(query => {
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
				nodeModel
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/management/scenario/">Achilles tendinopathy</a>'
			);
		});

		it("should rewrite third level chapter links", async () => {
			runQuery.mockImplementation(query => {
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
				nodeModel
			);

			expect(result).toBe(
				'<a href="/topics/achilles-tendinopathy/management/scenario/#test">Achilles tendinopathy</a>'
			);
		});
	});
});
