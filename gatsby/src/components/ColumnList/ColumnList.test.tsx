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
		expect(getByRole("list").className).toContain("plain");
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
