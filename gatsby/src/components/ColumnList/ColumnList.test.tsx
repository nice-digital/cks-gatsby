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

	it("should add CSS module class name to parent list", () => {
		const { getByRole } = render(
			<ColumnList>
				<li>Test</li>
			</ColumnList>
		);
		expect(getByRole("list").className).toBe("list");
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
