import React from "react";
import { render, waitFor, screen } from "@testing-library/react";

import TopicsPage, { TopicsPageProps } from "../topics";
import { Topic } from "src/types";
import { textContentMatcher } from "test-utils";

describe("TopicsPage", () => {
	const topics: Topic[] = [
		{
			id: "t1",
			topicName: "Achilles tendinopathy",
			slug: "achilles-tendinopathy",
			aliases: ["Tendinopathy (achilles)"],
		} as Topic,
		{
			id: "t2",
			topicName: "Acne vulgaris",
			slug: "acne-vulgaris",
			aliases: [] as string[],
		} as Topic,
		{
			id: "t3",
			topicName: "Cataracts",
			slug: "cataracts",
			aliases: [] as string[],
		} as Topic,
	];

	beforeEach(() => {
		// eslint-disable-next-line testing-library/no-render-in-setup
		render(
			<TopicsPage
				{...({
					data: {
						allTopics: { nodes: topics },
					},
				} as TopicsPageProps)}
			/>
		);
	});

	describe("SEO", () => {
		it("should render Health topics A to Z in the page title", async () => {
			await waitFor(() => {
				expect(document.title).toContain("Health topics A to Z | ");
			});
		});
	});

	describe("Breadcrumbs", () => {
		it.each([
			["NICE", "https://www.nice.org.uk/"],
			["CKS", "/"],
		])("Breadcrumbs (%s)", (breadcrumbText, expectedHref) => {
			expect(
				screen.queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render health topics A to Z as current page breadcrumb without link", () => {
			expect(
				screen.getByText(textContentMatcher("Health topics A to Z"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with speciality name", () => {
			expect(
				screen.getByText("Health topics A to Z", {
					selector: "h1",
				})
			).toBeInTheDocument();
		});
		it("should render lead paragraph", () => {
			expect(
				screen.getByText(
					"There are over 370 topics, with focus on the most common and significant presentations in primary care."
				)
			).toBeInTheDocument();
		});
	});

	describe("Alphabet", () => {
		let alphabetList: HTMLElement;
		beforeEach(() => {
			alphabetList = screen.getByLabelText("Letters A to Z");
		});

		it("should render an ordered list labelled Letters A to Z", () => {
			expect(alphabetList).toHaveProperty("tagName", "OL");
		});

		it("should render a-to-z ID on alphabet list", () => {
			expect(alphabetList).toHaveProperty("id", "a-to-z");
		});

		it("should render a list item for each letter", () => {
			// eslint-disable-next-line testing-library/no-node-access
			expect(alphabetList.children).toHaveLength(26);
		});

		it("should render internal anchor for letter with topics", () => {
			const letterAAnchor = screen.getByLabelText("Letter 'A'");
			expect(letterAAnchor).toHaveProperty("tagName", "A");
			expect(letterAAnchor).toHaveAttribute("href", "#a");
			expect(letterAAnchor).toHaveTextContent("A");

			const letterCAnchor = screen.getByLabelText("Letter 'C'");
			expect(letterCAnchor).toHaveProperty("tagName", "A");
			expect(letterCAnchor).toHaveAttribute("href", "#c");
			expect(letterCAnchor).toHaveTextContent("C");
		});

		it("should not render anchor for letter with no topics", () => {
			const letterQAnchor = screen.getByLabelText("Letter 'Q' (no topics)");
			expect(letterQAnchor).not.toHaveProperty("tagName", "A");
			expect(letterQAnchor).toHaveTextContent("Q");
		});
	});

	describe("A to Z", () => {
		it("should render A to Z navigation element", () => {
			expect(screen.getByLabelText("Health topics A to Z")).toHaveProperty(
				"tagName",
				"NAV"
			);
		});

		it("should render ordered list of letters that have at least 1 topic", () => {
			const list = screen.getByLabelText("Letters A to Z with matching topics");
			expect(list).toHaveProperty("tagName", "OL");
			// eslint-disable-next-line testing-library/no-node-access
			expect(list.children).toHaveLength(3); // See test data above - 2 topics and 1 alias
		});

		it("should render heading 2 with id and label for each letter", () => {
			const letterHeadingA = screen.getByLabelText("Topics starting with 'A'");
			expect(letterHeadingA).toHaveProperty("tagName", "H2");
			expect(letterHeadingA).toHaveAttribute("id", "a");

			const letterHeadingT = screen.getByLabelText("Topics starting with 'T'");
			expect(letterHeadingT).toHaveProperty("tagName", "H2");
			expect(letterHeadingT).toHaveAttribute("id", "t");
		});

		it("should render list of topics labelled by the letter heading for each letter", () => {
			expect(screen.getByLabelText("C")).toHaveProperty("tagName", "OL");
		});

		it("should render topic link for each topic", () => {
			expect(screen.getByText("Achilles tendinopathy")).toHaveAttribute(
				"href",
				"/topics/achilles-tendinopathy/"
			);
			expect(screen.getByText("Acne vulgaris")).toHaveAttribute(
				"href",
				"/topics/acne-vulgaris/"
			);
		});

		it("should render topic link for aliases", () => {
			expect(screen.getByText("Tendinopathy (achilles)")).toHaveAttribute(
				"href",
				"/topics/achilles-tendinopathy/"
			);
		});
	});
});
