import React from "react";
import TopicsPage, { TopicsPageProps } from "../topics";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { Topic } from "src/types";
import { textContentMatcher } from "test-utils";

describe("TopicsPage", () => {
	const topics: Topic[] = [
		{
			id: "t1",
			topicName: "Achilles tendinopathy",
			slug: "achilles-tendinopathy",
		} as Topic,
		{
			id: "t2",
			topicName: "Acne vulgaris",
			slug: "acne-vulgaris",
		} as Topic,
		{
			id: "t3",
			topicName: "Cataracts",
			slug: "cataracts",
		} as Topic,
	];

	let renderResult: RenderResult;
	beforeEach(() => {
		renderResult = render(
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
				renderResult.queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render health topics A to Z as current page breadcrumb without link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("Health topics A to Z"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with speciality name", () => {
			expect(
				renderResult.queryByText("Health topics A to Z", {
					selector: "h1",
				})
			).toBeInTheDocument();
		});
		it("should render lead paragraph", () => {
			expect(
				renderResult.queryByText(
					"There are over 370 topics, with focus on the most common and significant presentations in primary care."
				)
			).toBeInTheDocument();
		});
	});

	describe("Alphabet", () => {
		let alphabetList: HTMLElement;
		beforeEach(() => {
			const { getByLabelText } = renderResult;
			alphabetList = getByLabelText("Letters A to Z");
		});

		it("should render an ordered list labelled Letters A to Z", () => {
			expect(alphabetList).toHaveProperty("tagName", "OL");
		});

		it("should render a-to-z ID on alphabet list", () => {
			expect(alphabetList).toHaveProperty("id", "a-to-z");
		});

		it("should render a list item for each letter", () => {
			expect(alphabetList.children).toHaveLength(26);
		});

		it("should render internal anchor for letter with topics", () => {
			const { getByLabelText } = renderResult;

			const letterAAnchor = getByLabelText("Letter 'A'");
			expect(letterAAnchor).toHaveProperty("tagName", "A");
			expect(letterAAnchor).toHaveAttribute("href", "#a");
			expect(letterAAnchor).toHaveTextContent("A");

			const letterCAnchor = getByLabelText("Letter 'C'");
			expect(letterCAnchor).toHaveProperty("tagName", "A");
			expect(letterCAnchor).toHaveAttribute("href", "#c");
			expect(letterCAnchor).toHaveTextContent("C");
		});

		it("should not render anchor for letter with no topics", () => {
			const { getByLabelText } = renderResult;
			const letterQAnchor = getByLabelText("Letter 'Q' (no topics)");
			expect(letterQAnchor).not.toHaveProperty("tagName", "A");
			expect(letterQAnchor).toHaveTextContent("Q");
		});
	});

	describe("A to Z", () => {
		it("should render A to Z navigation element", () => {
			const { getByLabelText } = renderResult;
			expect(getByLabelText("Health topics A to Z")).toHaveProperty(
				"tagName",
				"NAV"
			);
		});

		it("should render ordered list of letters that have at least 1 topic", () => {
			const { getByLabelText } = renderResult;
			const list = getByLabelText("Letters A to Z with matching topics");
			expect(list).toHaveProperty("tagName", "OL");
			expect(list.children).toHaveLength(2); // See test data above
		});

		it("should render heading 2 with id and label for each letter", () => {
			const { getByLabelText } = renderResult;
			const letterHeading = getByLabelText("Topics starting with 'A'");
			expect(letterHeading).toHaveProperty("tagName", "H2");
			expect(letterHeading).toHaveAttribute("id", "a");
		});

		it("should render list of topics labelled by the letter heading for each letter", () => {
			const { getByLabelText } = renderResult;
			expect(getByLabelText("C")).toHaveProperty("tagName", "OL");
		});

		it("should render topic link for each topic", () => {
			const { getByText } = renderResult;
			expect(getByText("Achilles tendinopathy")).toHaveAttribute(
				"href",
				"/topics/achilles-tendinopathy/"
			);
			expect(getByText("Acne vulgaris")).toHaveAttribute(
				"href",
				"/topics/acne-vulgaris/"
			);
		});
	});
});
