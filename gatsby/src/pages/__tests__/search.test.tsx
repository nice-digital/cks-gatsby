import React from "react";
import fetch from "jest-fetch-mock";
import { renderWithRouter, textContentMatcher } from "test-utils";
import { waitFor, fireEvent, screen } from "@testing-library/react";
import * as searchResponseLong from "./sample-data/search-response-long.json";
import * as searchResponseLongPage2 from "./sample-data/search-response-long-page-2.json";
import * as searchResponseShort from "./sample-data/search-response-short.json";
import SearchPage from "../search";

fetch.enableMocks();

jest.useFakeTimers();

describe("Search Page", () => {
	beforeEach(() => {
		fetch.resetMocks();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it("should render a loading message before the request comes in", async () => {
		renderWithRouter(<SearchPage />);
		expect(screen.queryByText("Loading")).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.queryByText("Loading")).not.toBeInTheDocument();
		});
	});

	it("should display the total number of search results", async () => {
		fetch.mockResponse(JSON.stringify(searchResponseLong));
		renderWithRouter(<SearchPage />);
		await waitFor(() => {
			expect(
				screen.queryByText(
					textContentMatcher(
						`${searchResponseLong.resultCount.toString()} results for ${
							searchResponseLong.finalSearchText
						}`
					)
				)
			).toBeInTheDocument();
		});
	});

	describe("Breadcrumbs", () => {
		it("should not link to the original query if we're on page 1", async () => {
			fetch.mockResponse(JSON.stringify(searchResponseLong));
			renderWithRouter(<SearchPage />);
			await waitFor(() => {
				expect(
					screen.queryByText(textContentMatcher("Search results for test"), {
						selector: ".breadcrumbs a",
					})
				).toBeFalsy();
			});
		});

		it("should include a link to the original query if we're on page >= 2", async () => {
			fetch.mockResponse(JSON.stringify(searchResponseLongPage2));
			renderWithRouter(<SearchPage />);
			await waitFor(() => {
				expect(
					screen.queryByText(textContentMatcher("Search results for test"), {
						selector: ".breadcrumbs a",
					})
				).toBeTruthy();
			});
		});
	});

	it("should not show any pagination if there are fewer results than the supplied page limit", async () => {
		fetch.mockResponse(JSON.stringify(searchResponseShort));
		renderWithRouter(<SearchPage />);
		await waitFor(() => {
			expect(screen.queryByLabelText("Pagination")).toBeFalsy();
		});
	});

	it("should show both the original search term and the corrected search term if present", async () => {
		fetch.mockResponse(JSON.stringify(searchResponseShort));
		renderWithRouter(<SearchPage />);
		await waitFor(() => {
			expect(
				screen.getByText(searchResponseShort.originalSearch.searchText)
			).toBeInTheDocument();
		});

		expect(
			await screen.findByText(searchResponseShort.finalSearchText)
		).toBeInTheDocument();
	});

	it("should fall back to error message if the response doesn't come back", async () => {
		fetch.mockReject(new Error("Something's gone wrong!"));
		renderWithRouter(<SearchPage />);
		expect(
			await screen.findByRole("heading", {
				name: "Sorry, there is a problem with search",
			})
		).toBeInTheDocument();
	});

	describe("Screen reader announcements", () => {
		it("should make a screen reader announcement when the search results have loaded", async () => {
			fetch.mockResponse(JSON.stringify(searchResponseShort));
			const { container } = renderWithRouter(<SearchPage />);
			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			const ariaLiveDiv = container.querySelector("[aria-live]");
			expect(ariaLiveDiv?.textContent).toEqual("");
			await waitFor(() => {
				expect(ariaLiveDiv?.textContent).toEqual("Search results loaded");
			});
		});

		it("should make a screen reader announcement when the search result response has errored", async () => {
			fetch.mockReject(new Error("Something's gone wrong!"));
			const { container } = renderWithRouter(<SearchPage />);
			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			const ariaLiveDiv = container.querySelector("[aria-live]");
			expect(ariaLiveDiv?.textContent).toEqual("");
			await waitFor(() => {
				expect(ariaLiveDiv?.textContent).toEqual(
					"There was an error getting search results"
				);
			});
		});

		it("should make a screen reader announcement when the search result response is loading", async () => {
			fetch.mockResponse(JSON.stringify(searchResponseLong));
			const { container } = renderWithRouter(<SearchPage />);
			// eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
			const ariaLiveDiv = container.querySelector("[aria-live]");
			fireEvent.click(await screen.findByText("Next page"));
			await waitFor(() => {
				expect(ariaLiveDiv?.textContent).toEqual("Loading search results");
			});
		});
	});
});
