/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChapterLevel1Page, { ChapterLevel1PageProps } from "./ChapterLevel1";
import { ChapterLevel1, PartialChapter } from "../../types";

const getDefaultTestProps = (): ChapterLevel1PageProps =>
	(({
		pageContext: {
			chapter: {
				id: "abc123",
				fullItemName: "Background information",
				depth: 1,
				slug: "background-information",
				htmlHeader: "<!-- Start -><h1>Background information</h1><!-- End ->",
				htmlStringContent: "<p>Some content</p>",
				subChapters: [
					{
						id: "dfntn",
						slug: "definition",
						fullItemName: "Definition",
					} as PartialChapter,
					{
						id: "prvlnc",
						slug: "prevalence",
						fullItemName: "Prevalence",
					} as PartialChapter,
				],
				topic: {
					topicName: "Asthma",
					slug: "asthma",
					lastRevised: "Last revised in April&nbsp;2020",
					chapters: [
						{
							id: "smry",
							fullItemName: "Summary",
							subChapters: [] as PartialChapter[],
						} as PartialChapter,
					],
				},
			} as ChapterLevel1,
		},
	} as unknown) as ChapterLevel1PageProps);

describe("ChapterLevel1", () => {
	let props = getDefaultTestProps();
	beforeEach(() => {
		render(<ChapterLevel1Page {...props} />);
	});

	afterEach(() => {
		// Reset props for the next test in case they've been amended
		props = getDefaultTestProps();
	});

	describe("Breadcrumbs", () => {
		it("should have homepage breadcrumb", () => {
			expect(
				screen.getByText("CKS", { selector: ".breadcrumbs a" })
			).toHaveAttribute("href", "/");
		});
		it("should have parent topic breadcrumb", () => {
			expect(
				screen.getByText("Asthma", { selector: ".breadcrumbs a" })
			).toHaveAttribute("href", "/topics/asthma/");
		});
	});

	describe("SEO", () => {
		it("should use fallback meta description when summary is empty", async () => {
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute("content", "Background information, Asthma, CKS");
			});
		});

		it("should use summary field for meta description", async () => {
			cleanup();
			props.pageContext.chapter.summary = "this is some summary text";
			render(<ChapterLevel1Page {...props} />);
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute("content", "this is some summary text");
			});
		});
	});

	describe("page header", () => {
		it("should render parent topic name with chapter name as heading 1", () => {
			const heading = screen.getAllByRole("heading")[0];
			expect(heading).toHaveProperty("tagName", "H1");
			expect(heading).toHaveProperty(
				"textContent",
				"Asthma: Background information"
			);
		});

		it("should render last revised text as lead paragraph", () => {
			const lead = screen.getByText("Last revised in April 2020");
			expect(lead.parentElement).toHaveClass("page-header__lead");
		});
	});

	describe("print", () => {
		it("should render print button", () => {
			expect(screen.getByText("Print this page")).toBeInTheDocument();
		});

		it("should print window on print button click", () => {
			const oldPrint = global.print;
			const printSpy = jest.fn();
			global.print = printSpy;
			const printBtn = screen.getByText("Print this page");
			userEvent.click(printBtn);
			expect(printSpy).toHaveBeenCalled();
			global.print = oldPrint;
		});
	});

	describe("title", () => {
		it("should have title with chapter name and parent topic name", async () => {
			await waitFor(() => {
				expect(document.title).toEqual(
					"Background information | Asthma | CKS | NICE"
				);
			});
		});
	});

	describe("html string content", () => {
		it("should render html string content as chapter body", () => {
			expect(
				screen.getByLabelText("Background information", {
					selector: "section",
				}).innerHTML
			).toContain("<p>Some content</p>");
		});
	});

	describe("no html string content/custom nav", () => {
		beforeEach(() => {
			cleanup();
			props.pageContext.chapter.htmlStringContent = "<!-- No content -->";
			render(<ChapterLevel1Page {...props} />);
		});

		it("should render visually hidden heading 2 with html header content", () => {
			const heading = screen.getByText("Background information", {
				selector: "h2",
			});

			expect(heading).toHaveClass("visually-hidden");
			expect(heading).toHaveAttribute("id", "background-information");
		});

		it("should render custom nav labelled with the chapter name", () => {
			expect(
				screen.getByLabelText("Background information", { selector: "nav" })
			).toBeInTheDocument();
		});

		it("should render custom nav list with aria label", () => {
			expect(
				screen.getByLabelText("Pages within Background information")
			).toHaveProperty("tagName", "UL");
		});

		it("should render anchors for each sub chapter", () => {
			const definitionLink = screen.getByText("Definition");

			expect(definitionLink.tagName).toBe("A");
			expect(definitionLink).toHaveAttribute(
				"href",
				"/topics/asthma/background-information/definition/"
			);

			const prevalenceLink = screen.getByText("Prevalence");

			expect(prevalenceLink.tagName).toBe("A");
			expect(prevalenceLink).toHaveAttribute(
				"href",
				"/topics/asthma/background-information/prevalence/"
			);
		});
	});
});
