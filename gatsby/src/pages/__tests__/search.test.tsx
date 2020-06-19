import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import { renderWithRouter } from "test-utils";

import SearchPage from "../search";

enableFetchMocks();

describe("Search Page", () => {
	it("should render a loading message before the request comes in", () => {
		const el = renderWithRouter(<SearchPage />);
		expect(el.getByText("loading")).toBeInTheDocument();
	});
});
