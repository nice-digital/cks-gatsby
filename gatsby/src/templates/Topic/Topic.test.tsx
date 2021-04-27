/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, waitFor, screen, RenderResult } from "@testing-library/react";
import { textContentMatcher } from "test-utils";

import { ChapterLevel1, Topic, PartialChapter } from "../../types";

import TopicPage, { TopicPageProps } from "./Topic";

const topic: Topic = {
	id: "tpc987",
	lastRevised: "Last revised in April&nbsp;2020",
	topicName: "Asthma",
	slug: "asthma",
	topicId: "2a0a90e6-1c4e-4b6a-9ce2-3379dd122594",
	topicSummary:
		"Asthma is a chronic inflammatory condition of the airways.The airways are hyper-responsive and constrict easily in response to a wide range of stimuli",
	chapters: [
		{
			fullItemName: "Summary",
			id: "chptr123",
			slug: "summary",
			subChapters: [],
		},
		{
			fullItemName: "Have I got the right topic?",
			id: "chptr456",
			slug: "have-i-got-the-right-topic",
			subChapters: [],
		},
	] as PartialChapter[],
} as Topic;

const firstChapter: ChapterLevel1 = {
	id: "chptr123",
	fullItemName: "Summary",
	slug: "summary",
	depth: 1,
	htmlHeader: "<h1>Asthma: Summary</h1>",
	htmlStringContent:
		"<p>Asthma is a chronic inflammatory condition of the airways.</p>",
	topic: topic,
	subChapters: [],
} as ChapterLevel1;

describe("TopicPage", () => {
	let renderResult: RenderResult;

	beforeEach(() => {
		renderResult = render(
			<TopicPage {...({ data: { topic, firstChapter } } as TopicPageProps)} />
		);
	});

	describe("SEO", () => {
		it("should render the topic name in the page title", async () => {
			await waitFor(() => {
				expect(document.title).toContain("Asthma | Health topics A to Z");
			});
		});

		it("should use topic summary for meta description", async () => {
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute("content", topic.topicSummary);
			});
		});
	});

	describe("Breadcrumbs", () => {
		it.each([
			["NICE", "https://www.nice.org.uk/"],
			["CKS", "/"],
			["Health topics A to Z", "/topics/"],
		])("Breadcrumbs (%s)", (breadcrumbText, expectedHref) => {
			expect(
				screen.queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render topic name as current page breadcrumb without link", () => {
			expect(
				screen.queryByText(textContentMatcher("Asthma"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with topic name", () => {
			expect(
				screen.getByText("Asthma", {
					selector: "h1",
				})
			).toBeInTheDocument();
		});

		it("should render last revised text as lead paragraph", () => {
			const lead = screen.getByText("Last revised in April 2020");
			expect(lead.parentElement).toHaveClass("page-header__lead");
		});

		it("should render print button", () => {
			const print = screen.queryByText("Print this page");
			expect(print).toBeInTheDocument();
		});
	});

	describe("chapter menu", () => {
		let summaryAnchor: HTMLElement;
		beforeEach(() => {
			summaryAnchor = screen.getByText(textContentMatcher("Summary"), {
				selector: "nav a",
			});
		});

		it("should render list of top level chapters in topic menu", () => {
			const { container } = renderResult;
			expect(
				// eslint-disable-next-line testing-library/no-container
				container.querySelectorAll(".stacked-nav__list-item")
			).toHaveLength(2);
			expect(summaryAnchor).toHaveProperty("tagName", "A");
			expect(
				screen.getByText(textContentMatcher("Have I got the right topic?"), {
					selector: "nav a",
				})
			).toHaveProperty("tagName", "A");
		});

		it("should link summary menu item to topic landing page", () => {
			expect(summaryAnchor).toHaveAttribute("href", "/topics/asthma/");
		});

		it("should highlight summary as current page", () => {
			expect(summaryAnchor).toHaveAttribute("aria-current", "true");
		});
	});

	describe("body", () => {
		it("should render first chapter content in topic body", () => {
			expect(
				screen.getByText(
					"Asthma is a chronic inflammatory condition of the airways."
				)
			).toBeInTheDocument();
		});

		it("should render heading 2 for summary body", () => {
			const heading = screen.getByText("Asthma: Summary");
			expect(heading).toHaveProperty("tagName", "H2");
			expect(heading).toHaveAttribute("id", "summary");
		});
	});
});
