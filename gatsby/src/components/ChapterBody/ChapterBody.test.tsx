import React from "react";
import { render } from "@testing-library/react";
import { ChapterBody } from "./ChapterBody";
import { Chapter, PartialChapter } from "src/types";

describe("ChapterBody", () => {
	describe("no html string content/custom nav", () => {
		const chapter = {
			slug: "background-information",
			htmlHeader: "<!-- Start -><h1>Background information</h1><!-- End ->",
			htmlStringContent: "<!-- No content -->",
			parentChapter: undefined,
			subChapters: [
				{
					slug: "definition",
					fullItemName: "Definition",
					htmlHeader: "<h2>What is it?</h2>",
				} as Chapter,
				{
					slug: "prevalence",
					fullItemName: "Prevalence",
					htmlHeader: "<h2>What is the prevalence of asthma?</h2>",
				} as Chapter,
			] as Chapter[],
			topic: {
				slug: "asthma",
			},
		} as Chapter;

		it("should render navigation for top level chapters when HTML content is empty", () => {
			const { getByRole } = render(<ChapterBody chapter={chapter} />);
			expect(getByRole("navigation")).toBeTruthy();
		});

		it("should render visually hidden heading 2 with html header content", () => {
			const { getByText } = render(<ChapterBody chapter={chapter} />);

			const heading = getByText("Background information");

			expect(heading.tagName).toBe("H2");
			expect(heading).toHaveClass("visually-hidden");
			expect(heading).toHaveAttribute("id", "background-information");
		});

		it("should render custom nav and list labelled with the chapter name", () => {
			const { getAllByLabelText } = render(<ChapterBody chapter={chapter} />);

			const elements = getAllByLabelText("Background information");

			expect(elements[0].tagName).toBe("NAV");
			expect(elements[1].tagName).toBe("UL");
		});

		it("should render anchors for each sub chapter", () => {
			const { getByText } = render(<ChapterBody chapter={chapter} />);

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

	describe("html string content", () => {
		const chapter = {
			slug: "diagnosis1",
			fullItemName: "Diagnosis",
			htmlHeader: "<!-- Start -><h1>Diagnosis of asthma</h1><!-- End ->",
			htmlStringContent: "<p>Root content</p>",
			subChapters: [
				{
					slug: "diagnosis2",
					fullItemName: "Diagnosis",
					htmlHeader: "<h2>When should I suspect asthma?</h2>",
					htmlStringContent: "<p>Take a structured clinical history</p>",
					parentChapter: {} as PartialChapter,
					subChapters: [
						{
							slug: "third",
							fullItemName: "Test",
							htmlHeader: "<h2>A third level</h2>",
							htmlStringContent: "<p>Third level content</p>",
							parentChapter: {} as PartialChapter,
						} as Chapter,
					],
				} as Chapter,
				{
					slug: "prevalence",
					fullItemName: "Prevalence",
					htmlHeader: "<h2>What is the prevalence of asthma?</h2>",
					htmlStringContent:
						"<p>Asthma affects more than 300 million people worldwide</p>",
					parentChapter: {} as PartialChapter,
				} as Chapter,
			] as Chapter[],
			topic: {
				slug: "asthma",
			},
		} as Chapter;

		it("should convert an h1 htmlHeader into an h2", () => {
			const { getByText } = render(<ChapterBody chapter={chapter} />);
			expect(getByText("Diagnosis of asthma").tagName).toBe("H2");
		});

		it("should render the slug as an id on the chapter heading", () => {
			const { getByText } = render(<ChapterBody chapter={chapter} />);
			expect(getByText("Diagnosis of asthma")).toHaveAttribute(
				"id",
				"diagnosis1"
			);
		});

		it("should render a section labelled by the chapter name", () => {
			const { getByLabelText } = render(<ChapterBody chapter={chapter} />);
			expect(getByLabelText("Diagnosis of asthma").tagName).toBe("SECTION");
		});

		it("should render the HTML string content", () => {
			const { getByText } = render(<ChapterBody chapter={chapter} />);
			expect(getByText("Root content")).toBeTruthy();
			expect(getByText("Root content").tagName).toBe("P");
		});

		it("should not render sub chapters for top level content", () => {
			const { queryByText } = render(<ChapterBody chapter={chapter} />);
			expect(queryByText("When should I suspect asthma?")).toBeFalsy();
		});

		it("should render sub chapters resursively below top level", () => {
			const { getByText, getByLabelText } = render(
				<ChapterBody
					chapter={{ ...chapter, parentChapter: {} as PartialChapter }}
				/>
			);

			const expectNestedTopic = (
				titleText: string,
				id: string,
				content: string
			): void => {
				expect(getByText(titleText)).toHaveAttribute("id", id);
				expect(getByLabelText(titleText).tagName).toBe("SECTION");
				expect(getByText(content).tagName).toBe("P");
			};

			expectNestedTopic(
				"When should I suspect asthma?",
				"diagnosis2",
				"Take a structured clinical history"
			);

			expectNestedTopic("A third level", "third", "Third level content");

			expectNestedTopic(
				"What is the prevalence of asthma?",
				"prevalence",
				"Asthma affects more than 300 million people worldwide"
			);
		});
	});
});
