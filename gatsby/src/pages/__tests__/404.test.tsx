import React from "react";

import { renderWithRouter } from "test-utils";
import NotFoundPage from "../404";

describe("404", () => {
	it("should match snapshot", () => {
		const { container } = renderWithRouter(<NotFoundPage />);

		expect(container.firstChild).toMatchSnapshot();
	});

	it("should render h1 with correct text", () => {
		const { queryByText } = renderWithRouter(<NotFoundPage />);

		expect(queryByText("Page not found")?.tagName).toBe("H1");
	});
});
