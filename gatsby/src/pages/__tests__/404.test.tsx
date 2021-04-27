import React from "react";

import { waitFor, screen } from "@testing-library/react";
import { renderWithRouter } from "test-utils";
import NotFoundPage from "../404";

describe("404", () => {
	it("should match snapshot", () => {
		const { container } = renderWithRouter(<NotFoundPage />);

		expect(container).toMatchSnapshot();
	});

	it("should render h1 with correct text", () => {
		renderWithRouter(<NotFoundPage />);

		expect(screen.queryByText("We can't find this page")?.tagName).toBe("H1");
	});

	it("should render a noindex robots meta tag", async () => {
		renderWithRouter(<NotFoundPage />);

		await waitFor(() => {
			// eslint-disable-next-line testing-library/no-node-access
			expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
				"content",
				"noindex"
			);
		});
	});
});
