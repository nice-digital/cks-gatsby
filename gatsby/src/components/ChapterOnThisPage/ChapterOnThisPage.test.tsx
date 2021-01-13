import React from "react";
import { fireEvent, render, RenderResult } from "@testing-library/react";

import { ChapterOnThisPage } from "./ChapterOnThisPage";
import subChapers from "./subChapters.json";

const querySelectorMockImpl = (slug: string, yPos: number) => (
	selector: string
) =>
	({
		getBoundingClientRect: () => ({
			// Use a negative value for the dose heading to mock that we've scrolled to that heading
			top: selector === `#${slug}` ? yPos : 101,
		}),
		getAttribute: (attrName: string) => (attrName === "id" ? slug : null),
	} as Element);

describe("ChapterOnThisPage", () => {
	let renderResult: RenderResult,
		getByText: RenderResult["getByText"],
		queryByText: RenderResult["queryByText"],
		getByLabelText: RenderResult["getByLabelText"];

	beforeEach(() => {
		renderResult = render(<ChapterOnThisPage subChapters={subChapers} />);
		({ getByText, queryByText, getByLabelText } = renderResult);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("should render 'on this page' heading 2", () => {
		expect(getByText("On this page").tagName).toBe("H2");
	});

	it("should render nav labelled by the heading", () => {
		expect(getByLabelText("On this page").tagName).toBe("NAV");
	});

	it("should render ordered list of links", () => {
		expect(getByLabelText("Jump links to section on this page").tagName).toBe(
			"OL"
		);
	});

	it("should render top 2 levels of chapters", () => {
		expect(getByText("Dose")).toBeInTheDocument();
		expect(getByText("Contraindications and cautions")).toBeInTheDocument();
		expect(getByText("Theophylline")).toBeInTheDocument();
	});

	it("should not render third level of sub chapter", () => {
		expect(queryByText("Something")).toBeNull();
	});

	it("should should add specific class attribute to basis for recs sub chapters", () => {
		expect(getByText("Basis for recommendation").parentElement).toHaveClass(
			"basisForRecs"
		);
	});

	it("should set current location aria attribute for current scolled heading", () => {
		jest
			.spyOn(document, "querySelector")
			.mockImplementation(querySelectorMockImpl("dose", -10));

		fireEvent.scroll(window);

		expect(getByText("Dose")).toHaveAttribute("aria-current", "location");
	});

	it("should highlight active heading with a scroll threshold", () => {
		jest
			.spyOn(document, "querySelector")
			.mockImplementation(querySelectorMockImpl("dose", 99));

		fireEvent.scroll(window);

		expect(getByText("Dose")).toHaveAttribute("aria-current", "location");
	});

	it("should add expanded class to root list for current active heading", () => {
		jest
			.spyOn(document, "querySelector")
			.mockImplementation(querySelectorMockImpl("dose", 99));

		expect(getByLabelText("Sections within Dose")).not.toHaveClass(
			"expandedSubList"
		);

		fireEvent.scroll(window);

		expect(getByLabelText("Sections within Dose")).toHaveClass(
			"expandedSubList"
		);
	});

	it("should add expanded class to root list item with active child", () => {
		jest
			.spyOn(document, "querySelector")
			.mockImplementation(querySelectorMockImpl("theophylline", 99));

		expect(getByLabelText("Sections within Dose")).not.toHaveClass(
			"expandedSubList"
		);

		fireEvent.scroll(window);

		expect(getByLabelText("Sections within Dose")).toHaveClass(
			"expandedSubList"
		);
	});

	it("should detach window scroll event listener on unmount", () => {
		const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

		expect(removeEventListenerSpy).not.toHaveBeenCalled();

		renderResult.unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"scroll",
			expect.any(Function)
		);
	});
});
