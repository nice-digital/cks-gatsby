import React from "react";
import { render } from "@testing-library/react";

import { ColumnList } from "./ColumnList";

describe("ColumnList", () => {
	it("should render ordered list with given children", () => {
		const { getByText } = render(
			<ColumnList>
				<li>Test</li>
			</ColumnList>
		);

		expect(getByText("Test").tagName).toBe("LI");
		expect(getByText("Test").parentElement?.tagName).toBe("OL");
	});

	it("should add CSS module class name to parent list for standard (boxed) variant", () => {
		const { getByRole } = render(
			<ColumnList>
				<li>Test</li>
			</ColumnList>
		);
		expect(getByRole("list").className).toContain("boxed");
	});

	it("should add CSS module class name to parent list for the plain variant", () => {
		const { getByRole } = render(
			<ColumnList plain>
				<li>Test</li>
			</ColumnList>
		);
		expect(getByRole("list").className).toEqual("plain");
	});

	it("should add CSS module class name to parent list for the 2 column variant", () => {
		const { getByRole } = render(
			<ColumnList columns={2}>
				<li>Test</li>
			</ColumnList>
		);
		expect(getByRole("list").className).toEqual("boxed cols2");
	});

	it("should add CSS module class name to parent list for the 3 column variant", () => {
		const { getByRole } = render(
			<ColumnList columns={3}>
				<li>Test</li>
			</ColumnList>
		);
		expect(getByRole("list").className).toEqual("boxed cols3");
	});

	it("should append className prop to rendered class attribute", () => {
		const { getByRole } = render(
			<ColumnList className="test">
				<li>Test</li>
			</ColumnList>
		);
		expect(getByRole("list").className).toEqual("boxed test");
	});

	it("should render additional props as attributes", () => {
		const { getByLabelText } = render(
			<ColumnList aria-label="Hello">
				<li>Test</li>
			</ColumnList>
		);

		expect(getByLabelText("Hello")).toBeTruthy();
	});
});
