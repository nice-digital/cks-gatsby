import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { textContentMatcher } from "test-utils";

import { TopicChaptersMenu } from "./TopicChaptersMenu";

import {
	ChapterLevel1,
	ChapterLevel2,
	PartialTopicWithChapters,
} from "src/types";

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
	aliases: [],
	lastRevised: "Last revised in April&nbsp;2020",
	topicId: "t1",
	chapters: [chapter1, chapter2],
};

describe("TopicChaptersMenu", () => {
	it("should render nav labelled with topic name", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);
		expect(screen.getByLabelText("Asthma chapters")).toBeInTheDocument();
	});

	it("should render nav item for each root chapter", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);
		expect(screen.getByLabelText("Asthma chapters")).toBeInTheDocument();
	});

	it("should use aria-current for current root chapter", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);
		expect(
			screen.getByText(textContentMatcher("Summary"), { selector: "a" })
		).toHaveAttribute("aria-current", "true");
		expect(
			screen.getByText(textContentMatcher("How up-to-date is this topic?"), {
				selector: "a",
			})
		).toHaveAttribute("aria-current", "false");
	});

	it("should render href to the topic page for first (summary) chapter", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);
		expect(
			screen.getByText(textContentMatcher("Summary"), { selector: "a" })
		).toHaveAttribute("href", "/topics/asthma/");
	});

	it("should render href to the chapter page for subsequent chapters", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);
		expect(
			screen.getByText(textContentMatcher("How up-to-date is this topic?"), {
				selector: "a",
			})
		).toHaveAttribute("href", "/topics/asthma/how-up-to-date-is-this-topic/");
	});

	it("should not render sub chapters when root chapter is not active", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);
		expect(screen.queryByText("Changes")).toBeFalsy();
		expect(screen.queryByText("Updates")).toBeFalsy();
	});

	it("should render sub chapters when root chapter is active", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter2} />);
		expect(screen.getByText("Changes")).toBeInTheDocument();
		expect(screen.getByText("Updates")).toBeInTheDocument();
	});

	it("should render sub chapters sub chapter is active", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter_2_1} />);
		expect(
			screen.getByText("Changes", { selector: "span" })
		).toBeInTheDocument();
		expect(screen.getByText("Updates")).toBeInTheDocument();
	});

	it("should use aria-current for current sub chapter", () => {
		render(<TopicChaptersMenu topic={topic} currentChapter={chapter_2_1} />);
		expect(
			screen.getByText(textContentMatcher("Changes"), { selector: "a" })
		).toHaveAttribute("aria-current", "true");
	});

	describe("mobile nav", () => {
		it("should not render mobile toggle button in static build", () => {
			const spy = jest
				.spyOn(React, "useLayoutEffect")
				.mockImplementation(() => {
					/*noop*/
				});

			render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);

			expect(
				screen.queryByText(chapter1.fullItemName, { selector: "button" })
			).toBeNull();

			spy.mockRestore();
		});

		it("should render collapsed mobile menu button client side", () => {
			render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);

			const toggleBtn = screen.getByText(chapter1.fullItemName, {
				selector: "button",
			});
			expect(toggleBtn).toBeInTheDocument();
			expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
		});

		it("should render label for screenreaders", () => {
			render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);

			const toggleBtn = screen.getByText(chapter1.fullItemName, {
				selector: "button",
			});
			expect(toggleBtn).toBeInTheDocument();
			expect(toggleBtn).toHaveAttribute("aria-label", "Expand menu for Asthma");
		});

		it("should collapse toggle button on click", () => {
			render(<TopicChaptersMenu topic={topic} currentChapter={chapter1} />);

			const toggleBtn = screen.getByText(chapter1.fullItemName, {
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
