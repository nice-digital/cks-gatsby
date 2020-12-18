import React from "react";
import { render, RenderResult } from "@testing-library/react";

import { ChapterOnThisPage } from "./ChapterOnThisPage";
import { PartialChapter } from "src/types";

describe("ChapterOnThisPage", () => {
	const subChapers: PartialChapter[] = [
		{
			id: "1-dose",
			slug: "dose",
			fullItemName: "Dose",
			subChapters: [
				{
					id: "2-theophylline",
					slug: "theophylline",
					fullItemName: "Theophylline",
					subChapters: [
						{
							id: "3-something",
							slug: "something",
							fullItemName: "Something",
							subChapters: [],
						},
					],
				},
			],
		},
		{
			id: "1-contraindications",
			slug: "contraindications-cautions",
			fullItemName: "Contraindications and cautions",
			subChapters: [
				{
					id: "2-basis",
					slug: "basis",
					fullItemName: "Basis for recommendation",
					subChapters: [],
				},
			],
		},
	];

	let renderResult: RenderResult;
	beforeEach(() => {
		renderResult = render(<ChapterOnThisPage subChapters={subChapers} />);
	});

	it("should render 'on this page' heading 2", () => {
		const { getByText } = renderResult;
		expect(getByText("On this page").tagName).toBe("H2");
	});

	it("should render nav labelled by the heading", () => {
		const { getByLabelText } = renderResult;
		expect(getByLabelText("On this page").tagName).toBe("NAV");
	});

	it("should render ordered list of links", () => {
		const { getByLabelText } = renderResult;
		expect(getByLabelText("Jump links to section on this page").tagName).toBe(
			"OL"
		);
	});

	it("should render top 2 levels of chapters", () => {
		const { getByText } = renderResult;
		expect(getByText("Dose")).toBeInTheDocument();
		expect(getByText("Contraindications and cautions")).toBeInTheDocument();
		expect(getByText("Theophylline")).toBeInTheDocument();
	});

	it("should not render third level of sub chapter", () => {
		const { queryByText } = renderResult;
		expect(queryByText("Something")).toBeNull();
	});

	it("should should add specific class attribute to basis for recs sub chapters", () => {
		const { getByText } = renderResult;
		expect(getByText("Basis for recommendation").parentElement).toHaveClass(
			"basisForRecs"
		);
	});

	it.todo("should set aria current attribute for current scolled heading");
	// fireEvent.scroll

	it.todo("should highlight active heading with a scroll threshold");

	it.todo("should add expanded class to root list item with active child");

	it.todo("should detach window scroll event on unmount");
	// unmount()
});
