import React from "react";
import { TopicChaptersMenu } from "./TopicChaptersMenu";

import { PartialTopicWithChapters } from "src/types";
import { render } from "@testing-library/react";
import { textContentMatcher } from "test-utils";

const topic: PartialTopicWithChapters = {
	topicName: "Asthma",
	id: "a1b2",
	slug: "asthma",
	lastRevised: "Last revised in April&nbsp;2020",
	topicId: "t1",
	chapters: [
		{
			fullItemName: "Summary",
			id: "c1",
			slug: "summary",
			subChapters: [],
		},
		{
			fullItemName: "How up-to-date is this topic?",
			id: "c2",
			slug: "how-up-to-date-is-this-topic",
			subChapters: [
				{
					fullItemName: "Changes",
					id: "c2.1",
					slug: "changes",
					subChapters: [],
				},
				{
					fullItemName: "Updates",
					id: "c2.2",
					slug: "updates",
					subChapters: [],
				},
			],
		},
	],
};

describe("TopicChaptersMenu", () => {
	it("should render nav labelled with topic name", () => {
		const { getByLabelText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c1" />
		);
		expect(getByLabelText("Asthma chapters")).toBeInTheDocument();
	});

	it("should render nav item for each root chapter", () => {
		const { getByLabelText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c1" />
		);
		expect(getByLabelText("Asthma chapters")).toBeInTheDocument();
	});

	it("should use aria-current for current root chapter", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c1" />
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
			<TopicChaptersMenu topic={topic} currentChapterId="c1" />
		);
		expect(
			getByText(textContentMatcher("Summary"), { selector: "a" })
		).toHaveAttribute("href", "/topics/asthma/");
	});

	it("should render href to the chapter page for subsequent chapters", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c1" />
		);
		expect(
			getByText(textContentMatcher("How up-to-date is this topic?"), {
				selector: "a",
			})
		).toHaveAttribute("href", "/topics/asthma/how-up-to-date-is-this-topic/");
	});

	it("should not render sub chapters when root chapter is not active", () => {
		const { queryByText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c1" />
		);
		expect(queryByText("Changes")).toBeFalsy();
		expect(queryByText("Updates")).toBeFalsy();
	});

	it("should render sub chapters when root chapter is active", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c2" />
		);
		expect(getByText("Changes")).toBeInTheDocument();
		expect(getByText("Updates")).toBeInTheDocument();
	});

	it("should render sub chapters sub chapter is active", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c2.1" />
		);
		expect(getByText("Changes")).toBeInTheDocument();
		expect(getByText("Updates")).toBeInTheDocument();
	});

	it("should use aria-current for current sub chapter", () => {
		const { getByText } = render(
			<TopicChaptersMenu topic={topic} currentChapterId="c2.1" />
		);
		expect(
			getByText(textContentMatcher("Changes"), { selector: "a" })
		).toHaveAttribute("aria-current", "true");
	});
});
