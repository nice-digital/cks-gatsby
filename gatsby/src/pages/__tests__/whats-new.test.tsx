import React from "react";
import { navigate } from "gatsby";

import {
	renderWithRouter,
	RenderWithRouterResult,
	textContentMatcher,
} from "test-utils";
import WhatsNewPage, { WhatsNewPageProps } from "../whats-new";

const change1Updated = {
	id: "c1",
	title: "Reviewed",
	text: "Change 1 text",
	topic: {
		id: "t1",
		topicId: "topic1",
		topicName: "Topic One",
		slug: "topic-one",
	},
};

const change2New = {
	id: "c2",
	title: "New topic",
	text: "Change 2 text",
	topic: {
		id: "t2",
		topicId: "topic2",
		topicName: "Topic Two",
		slug: "topic-two",
	},
};

const change3Updated = {
	id: "c3",
	title: "Reviewed and updated",
	text: "Change 3 text",
	topic: {
		id: "t3",
		topicId: "topic3",
		topicName: "Topic Three",
		slug: "topic-three",
	},
};

const getDefaultTestProps = (): WhatsNewPageProps =>
	(({
		data: {
			site: {
				siteMetadata: {
					changesSinceDateISO: "2020-04",
					changesSinceDateFormatted: "April 2020",
				},
			},
			allCksChange: {
				nodes: [change1Updated, change2New, change3Updated],
			},
		},
	} as unknown) as WhatsNewPageProps);

describe("What's new page", () => {
	let props = getDefaultTestProps();
	let renderResult: RenderWithRouterResult;

	beforeEach(() => {
		renderResult = renderWithRouter(<WhatsNewPage {...props} />);
	});

	afterEach(() => {
		// Reset props for the next test in case they've been amended
		props = getDefaultTestProps();
	});

	describe("Breadcrumbs", () => {
		it("should render NICE homepage breadcrumb link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("Home"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "https://www.nice.org.uk/");
		});

		it("should render CKS home breadcrumb", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("CKS"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render CKS home breadcrumb", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("CKS"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render current page breadcrumb without link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("What's new"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with current date", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("What's new for April 2020"), {
					selector: "h1",
				})?.tagName
			).toBe("H1");
		});

		it("should render time tag with current date in heading 1", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText("April 2020", { selector: "h1 time" })
			).toHaveAttribute("datetime", "2020-04");
		});

		describe.each([
			[[change1Updated], "1 updated topic"],
			[[change1Updated, change1Updated], "2 updated topics"],
			[[change2New], "1 new topic"],
			[[change2New, change2New], "2 new topics"],
			[[change1Updated, change2New], "1 new topic and 1 updated topic"],
			[
				[change1Updated, change2New, change2New],
				"2 new topics and 1 updated topic",
			],
			[
				[change1Updated, change1Updated, change2New],
				"1 new topic and 2 updated topics",
			],
			[
				[change1Updated, change1Updated, change2New, change2New],
				"2 new topics and 2 updated topics",
			],
		])("should render lead", (input, expected) => {
			beforeAll(() => {
				props.data.allCksChange.nodes = input;
			});

			it(`should render lead for '${expected}'`, () => {
				const { getByText } = renderResult;
				expect(
					getByText(textContentMatcher(`${expected} for April 2020`))
				).toBeTruthy();
			});
		});
	});

	describe("Topic list", () => {
		it("should render visually hidden topic list heading with id", () => {
			const topicUpdatesHeading = renderResult.getByText("Topic updates");

			expect(topicUpdatesHeading).toHaveClass("visually-hidden");
			expect(topicUpdatesHeading).toHaveAttribute("id", "topic-updates");
		});

		it("should render update list labelled by heading", () => {
			expect(renderResult.getByLabelText("Topic updates").tagName).toBe("UL");
		});
	});

	describe("Individual topic change", () => {
		it("should render an article for each update object", () => {
			const { getAllByRole } = renderResult;

			expect(getAllByRole("article")).toHaveLength(
				props.data.allCksChange.nodes.length
			);
		});

		it("should render topic name as a heading 3", () => {
			const { getByText } = renderResult;

			const topicName = getByText(
				textContentMatcher(change1Updated.topic.topicName),
				{ selector: "h3" }
			);

			expect(topicName).toHaveClass("card__heading");
		});

		it("should render a link to the changed topic", () => {
			const { getByText } = renderResult;

			const topicName = getByText(change1Updated.topic.topicName);

			expect(topicName.tagName).toBe("A");
			expect(topicName).toHaveAttribute(
				"href",
				`/topics/${change1Updated.topic.slug}/`
			);
		});

		it("should render change text within the card summary", () => {
			const { getByText } = renderResult;
			expect(getByText(change1Updated.text)).toHaveClass("card__summary");
		});

		it("should render a new metadata tag for new topics", () => {
			const { getByText } = renderResult;
			expect(getByText(change2New.title)).toHaveClass("tag tag--new");
		});

		it("should render an updated metadata tag for updated topics", () => {
			const { getByText } = renderResult;
			expect(getByText(change1Updated.title)).toHaveClass("tag tag--updated");
		});
	});

	it("should render link to CKS development process", () => {
		const { getByText } = renderResult;
		expect(
			getByText("CKS development process", { selector: "a" })
		).toHaveAttribute("href", "/about/development/");
	});
});
