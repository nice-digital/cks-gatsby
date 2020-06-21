import React from "react";
import { render } from "@testing-library/react";
import ChapterLevel1Page, { ChapterLevel1PageProps } from "./ChapterLevel1";
import { ChapterLevel1, PartialChapter } from "../../types";

describe("ChapterLevel1", () => {
	let chapter: ChapterLevel1;
	beforeEach(() => {
		chapter = {
			id: "abc123",
			fullItemName: "Background information",
			depth: 1,
			slug: "background-information",
			htmlHeader: "<!-- Start -><h1>Background information</h1><!-- End ->",
			htmlStringContent: "<p>Some content</p>",
			subChapters: [
				{
					slug: "definition",
					fullItemName: "Definition",
				} as PartialChapter,
				{
					slug: "prevalence",
					fullItemName: "Prevalence",
				} as PartialChapter,
			],
			topic: {
				topicName: "Asthma",
				slug: "asthma",
				chapters: [
					{
						fullItemName: "Summary",
						subChapters: [] as PartialChapter[],
					} as PartialChapter,
				],
			},
		} as ChapterLevel1;
	});

	describe("Breadcrumbs", () => {
		it("should have homepage breadcrumb", () => {
			const { getByText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);

			expect(getByText("CKS", { selector: ".breadcrumbs a" })).toHaveAttribute(
				"href",
				"/"
			);
		});
		it("should have parent topic breadcrumb", () => {
			const { getByText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);

			expect(
				getByText("Asthma", { selector: ".breadcrumbs a" })
			).toHaveAttribute("href", "/topics/asthma/");
		});
	});

	describe("page header", () => {
		it("should render parent topic name with chapter name as heading 1", () => {
			const { getAllByRole } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);
			const heading = getAllByRole("heading")[0];
			expect(heading).toHaveProperty("tagName", "H1");
			expect(heading).toHaveProperty(
				"textContent",
				"Asthma: Background information"
			);
		});
	});

	describe("title", () => {
		it("should have title with chapter name and parent topic name", () => {
			render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);

			expect(document.title).toEqual(
				"Background information | Asthma | CKS | NICE"
			);
		});
	});

	describe("html string content", () => {
		it("should render html string content as chapter body", () => {
			const { getByLabelText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);
			expect(
				getByLabelText("Background information", {
					selector: "section",
				}).innerHTML
			).toContain("<p>Some content</p>");
		});
	});

	describe("no html string content/custom nav", () => {
		beforeEach(() => {
			chapter.htmlStringContent = "<!-- No content -->";
		});

		it("should render visually hidden heading 2 with html header content", () => {
			const { getByText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);

			const heading = getByText("Background information", { selector: "h2" });

			expect(heading).toHaveClass("visually-hidden");
			expect(heading).toHaveAttribute("id", "background-information");
		});

		it("should render custom nav labelled with the chapter name", () => {
			const { getByLabelText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);
			expect(getByLabelText("Background information")).toHaveProperty(
				"tagName",
				"NAV"
			);
		});

		it("should render custom nav list with aria label", () => {
			const { getByLabelText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);
			expect(
				getByLabelText("Pages within Background information")
			).toHaveProperty("tagName", "UL");
		});

		it("should render anchors for each sub chapter", () => {
			const { getByText } = render(
				<ChapterLevel1Page
					{...({ pageContext: { chapter } } as ChapterLevel1PageProps)}
				/>
			);

			const definitionLink = getByText("Definition");

			expect(definitionLink.tagName).toBe("A");
			expect(definitionLink).toHaveAttribute(
				"href",
				"/topics/asthma/background-information/definition/"
			);

			const prevalenceLink = getByText("Prevalence");

			expect(prevalenceLink.tagName).toBe("A");
			expect(prevalenceLink).toHaveAttribute(
				"href",
				"/topics/asthma/background-information/prevalence/"
			);
		});
	});
});
