import React from "react";
import { render, fireEvent } from "@testing-library/react";

import { BackToTop } from "./BackToTop";

describe("BackToTop", () => {
	it("should match snapshot", () => {
		expect(render(<BackToTop />).container).toMatchSnapshot();
	});

	it("should have a class of static on first render", () => {
		const { container } = render(<BackToTop />);
		expect(container.querySelectorAll(".static")).toHaveLength(1);
	});

	it("should have a class of fixed when the page is scrolled", () => {
		const renderResult = render(<BackToTop />);
		fireEvent.scroll(window, { target: { scrollY: 810 } });
		expect(renderResult.container.querySelectorAll(".static")).toHaveLength(1);
	});
});
