import React from "react";

import { waitFor } from "@testing-library/react";
import { renderWithRouter } from "test-utils";
import NotFoundPage from "../404";

describe("404", () => {
	it("should match snapshot", () => {
		const { container } = renderWithRouter(<NotFoundPage />);

		expect(container).toMatchSnapshot();
	});

	it("should render h1 with correct text", () => {
		const { queryByText } = renderWithRouter(<NotFoundPage />);

		expect(queryByText("Page not found")?.tagName).toBe("H1");
	});

	it("should render a noindex robots meta tag", async () => {
		renderWithRouter(<NotFoundPage />);

		await waitFor(() => {
			expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
				"content",
				"noindex"
			);
		});
	});
});
