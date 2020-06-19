import React from "react";

import { renderWithRouter } from "test-utils";

import SearchPage from "../search";

describe("Search Page", () => {
	it("should match snapshot", () => {
		const { container, debug } = renderWithRouter(<SearchPage />);
		debug();
		expect(container).toMatchSnapshot();
	});
});
