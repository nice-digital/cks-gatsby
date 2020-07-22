import React from "react";
import { render } from "@testing-library/react";
import { ChapterBody } from "./ChapterBody";
import { ChapterLevel1, ChapterLevel2, PartialChapter } from "src/types";

describe("ChapterBody", () => {
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
					htmlHeader: "<h2>When should I suspect asthma?</h2>",
					htmlStringContent: "<p>Take a structured clinical history</p>",
				} as ChapterLevel2,
				{
					slug: "prevalence",
					fullItemName: "Prevalence",
					htmlHeader: "<h2>What is the prevalence of asthma?</h2>",
					htmlStringContent:
						"<p>Asthma affects more than 300 million people worldwide</p>",
				} as ChapterLevel2,
			] as PartialChapter[],
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

	it("should convert an h1 htmlHeader into an h2", () => {
		const { getByText } = render(<ChapterBody chapter={chapter} />);
		expect(getByText("Background information").tagName).toBe("H2");
	});

	it("should convert an htmlHeader to the given heading level", () => {
		const { getByText } = render(
			<ChapterBody chapter={chapter} headingLevel={3} />
		);
		expect(getByText("Background information").tagName).toBe("H3");
	});

	it("should render the slug as an id on the chapter heading", () => {
		const { getByText } = render(<ChapterBody chapter={chapter} />);
		expect(getByText("Background information")).toHaveAttribute(
			"id",
			"background-information"
		);
	});

	it("should render a section labelled by the chapter name", () => {
		const { getByLabelText } = render(<ChapterBody chapter={chapter} />);
		expect(getByLabelText("Background information").tagName).toBe("SECTION");
	});

	it("should render the HTML string content", () => {
		const { getByText } = render(<ChapterBody chapter={chapter} />);
		expect(getByText("Some content")).toBeTruthy();
		expect(getByText("Some content").tagName).toBe("P");
	});

	describe("level 1 chapter", () => {
		it("should not render sub chapters for top level content", () => {
			const { queryByText } = render(<ChapterBody chapter={chapter} />);
			expect(queryByText("When should I suspect asthma?")).toBeFalsy();
		});
	});

	it("should render sub chapters resursively below top level", () => {
		chapter.depth = 2;

		const { getByText, getByLabelText } = render(
			<ChapterBody
				chapter={{ ...chapter, parentChapter: {} as PartialChapter }}
			/>
		);

		const expectNestedTopic = (
			headingText: string,
			id: string,
			content: string
		): void => {
			expect(getByText(headingText)).toHaveAttribute("id", id);
			expect(getByLabelText(headingText).tagName).toBe("SECTION");
			expect(getByText(content).tagName).toBe("P");
		};

		expectNestedTopic(
			"When should I suspect asthma?",
			"definition",
			"Take a structured clinical history"
		);

		expectNestedTopic(
			"What is the prevalence of asthma?",
			"prevalence",
			"Asthma affects more than 300 million people worldwide"
		);
	});
});
