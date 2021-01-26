import React from "react";
import userEvent from "@testing-library/user-event";

import { TopicChaptersMenu } from "./TopicChaptersMenu";

import {
	ChapterLevel1,
	ChapterLevel2,
	PartialTopicWithChapters,
} from "src/types";
import { render } from "@testing-library/react";
import { textContentMatcher } from "test-utils";

const chapter_2_1 = ({
	fullItemName: "Changes",
	id: "c2.1",
	slug: "changes",
	subChapters: [],
} as unknown) as ChapterLevel2;

const chapter_2_2 = ({
	fullItemName: "Updates",
	id: "c2.2",
	slug: "updates",
	subChapters: [],
} as unknown) as ChapterLevel2;

const chapter2 = ({
	fullItemName: "How up-to-date is this topic?",
	id: "c2",
	slug: "how-up-to-date-is-this-topic",
	subChapters: [chapter_2_1, chapter_2_2],
} as unknown) as ChapterLevel1;

const chapter1 = ({
	fullItemName: "Summary",
	id: "c1",
	slug: "summary",
	subChapters: [],
} as unknown) as ChapterLevel1;

const topic: PartialTopicWithChapters = {
	topicName: "Asthma",
	id: "a1b2",
	slug: "asthma",
	lastRevised: "Last revised in April&nbsp;2020",
	topicId: "t1",
	chapters: [chapter1, chapter2],
};

describe("TopicChaptersMenu", () => {
	it("should render nav labelled with topic name", () => {
		const { getByLabelText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
		);
		expect(getByLabelText("Asthma chapters")).toBeInTheDocument();
	});

	it("should render nav item for each root chapter", () => {
		const { getByLabelText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
		);
		expect(getByLabelText("Asthma chapters")).toBeInTheDocument();
	});

	it("should use aria-current for current root chapter", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
		);
		expect(
			getByText(textContentMatcher("Summary"), { selector: "a" })
		).toHaveAttribute("aria-current", "true");
		expect(
			getByText(textContentMatcher("How up-to-date is this topic?"), {
				selector: "a",
			})
		).toHaveAttribute("aria-current", "false");
	});

	it("should render href to the topic page for first (summary) chapter", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
		);
		expect(
			getByText(textContentMatcher("Summary"), { selector: "a" })
		).toHaveAttribute("href", "/topics/asthma/");
	});

	it("should render href to the chapter page for subsequent chapters", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
		);
		expect(
			getByText(textContentMatcher("How up-to-date is this topic?"), {
				selector: "a",
			})
		).toHaveAttribute("href", "/topics/asthma/how-up-to-date-is-this-topic/");
	});

	it("should not render sub chapters when root chapter is not active", () => {
		const { queryByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
		);
		expect(queryByText("Changes")).toBeFalsy();
		expect(queryByText("Updates")).toBeFalsy();
	});

	it("should render sub chapters when root chapter is active", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter2} />
		);
		expect(getByText("Changes")).toBeInTheDocument();
		expect(getByText("Updates")).toBeInTheDocument();
	});

	it("should render sub chapters sub chapter is active", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter_2_1} />
		);
		expect(getByText("Changes", { selector: "span" })).toBeInTheDocument();
		expect(getByText("Updates")).toBeInTheDocument();
	});

	it("should use aria-current for current sub chapter", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapter={chapter_2_1} />
		);
		expect(
			getByText(textContentMatcher("Changes"), { selector: "a" })
		).toHaveAttribute("aria-current", "true");
	});

	describe("mobile nav", () => {
		it("should not render mobile toggle button in static build", () => {
			const spy = jest
				.spyOn(React, "useLayoutEffect")
				.mockImplementation(() => {
					/*noop*/
				});

			const { queryByText } = render(
				<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
			);

			expect(
				queryByText(chapter1.fullItemName, { selector: "button" })
			).toBeNull();

			spy.mockRestore();
		});

		it("should render collapsed mobile menu button client side", () => {
			const { getByText } = render(
				<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
			);

			const toggleBtn = getByText(chapter1.fullItemName, {
				selector: "button",
			});
			expect(toggleBtn).toBeInTheDocument();
			expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
		});

		it("should render label for screenreaders", () => {
			const { getByText } = render(
				<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
			);

			const toggleBtn = getByText(chapter1.fullItemName, {
				selector: "button",
			});
			expect(toggleBtn).toBeInTheDocument();
			expect(toggleBtn).toHaveAttribute("aria-label", "Expand menu for Asthma");
		});

		it("should collapse toggle button on click", () => {
			const { getByText } = render(
				<TopicChaptersMenu topic={topic} currentChapter={chapter1} />
			);

			const toggleBtn = getByText(chapter1.fullItemName, {
				selector: "button",
			});

			userEvent.click(toggleBtn);

			expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
			expect(toggleBtn).toHaveAttribute(
				"aria-label",
				"Collapse menu for Asthma"
			);
		});
	});
});
