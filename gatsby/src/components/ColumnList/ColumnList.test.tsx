import React from "react";
import { render, screen } from "@testing-library/react";

import { ColumnList } from "./ColumnList";

describe("ColumnList", () => {
	it("should render ordered list with given children", () => {
		render(
			<ColumnList>
				<li>Test</li>
			</ColumnList>
		);

		expect(screen.getByText("Test").tagName).toBe("LI");
		// eslint-disable-next-line testing-library/no-node-access
		expect(screen.getByText("Test").parentElement?.tagName).toBe("OL");
	});

	it("should add CSS module class name to parent list for standard (boxed) variant", () => {
		render(
			<ColumnList>
				<li>Test</li>
			</ColumnList>
		);
		expect(screen.getByRole("list").className).toContain("boxed");
	});

	it("should add CSS module class name to parent list for the plain variant", () => {
		render(
			<ColumnList plain>
				<li>Test</li>
			</ColumnList>
		);
		expect(screen.getByRole("list").className).toEqual("plain");
	});

	it("should add CSS module class name to parent list for the 2 column variant", () => {
		render(
			<ColumnList columns={2}>
				<li>Test</li>
			</ColumnList>
		);
		expect(screen.getByRole("list").className).toEqual("boxed cols2");
	});

	it("should add CSS module class name to parent list for the 3 column variant", () => {
		render(
			<ColumnList columns={3}>
				<li>Test</li>
			</ColumnList>
		);
		expect(screen.getByRole("list").className).toEqual("boxed cols3");
	});

	it("should append className prop to rendered class attribute", () => {
		render(
			<ColumnList className="test">
				<li>Test</li>
			</ColumnList>
		);
		expect(screen.getByRole("list").className).toEqual("boxed test");
	});

	it("should render additional props as attributes", () => {
		render(
			<ColumnList aria-label="Hello">
				<li>Test</li>
			</ColumnList>
		);

		expect(screen.getByLabelText("Hello")).toBeTruthy();
	});
});
