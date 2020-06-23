import React from "react";
import fetch from "jest-fetch-mock";
import { renderWithRouter, textContentMatcher } from "test-utils";
import { waitForDomChange, queryByText } from "@testing-library/react";

import * as searchResponseTest from "./sample-data/search-response-for-test.json";
import * as searchResponseMonkey from "./sample-data/search-response-monkey.json";
import SearchPage from "../search";

fetch.enableMocks();

describe("Search Page", () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	it("should render a loading message before the request comes in", async () => {
		const { queryByText } = renderWithRouter(<SearchPage />);
		expect(queryByText("loading")).toBeInTheDocument();
		await waitForDomChange();
		expect(queryByText("loading")).not.toBeInTheDocument();
	});

	it("should display the total number of search results", async () => {
		fetch.mockResponse(JSON.stringify(searchResponseTest));
		const component = renderWithRouter(<SearchPage />);
		await waitForDomChange();
		expect(
			component.queryByText(
				textContentMatcher(
					`${searchResponseTest.resultCount.toString()} results for ${
						searchResponseTest.finalSearchText
					}`
				)
			)
		).toBeInTheDocument();
	});

	it("should not show any pagination if there are fewer results than the supplied page limit", async () => {
		fetch.mockResponse(JSON.stringify(searchResponseMonkey));
		const component = renderWithRouter(<SearchPage />);
		await waitForDomChange();
		expect(component.container.querySelector(".simple-pagination")).toBeFalsy();
	});

	it("should show both the original search term and the corrected search term if present", async () => {
		fetch.mockResponse(JSON.stringify(searchResponseMonkey));
		const component = renderWithRouter(<SearchPage />);
		await waitForDomChange();
		expect(
			await component.findByText(searchResponseMonkey.originalSearch.searchText)
		).toBeInTheDocument();
		expect(
			await component.findByText(searchResponseMonkey.finalSearchText)
		).toBeInTheDocument();
	});

	it("should fall back to error message if the response doesn't come back", async () => {
		fetch.mockReject(new Error("Something's gone wrong!"));
		const component = renderWithRouter(<SearchPage />);
		await waitForDomChange();
		expect(
			component.queryByText(textContentMatcher("Error"), {
				selector: "h1",
			})
		).toBeInTheDocument();
	});
});
