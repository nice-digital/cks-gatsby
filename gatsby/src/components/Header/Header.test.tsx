import React from "react";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import { navigate } from "gatsby";
import { renderWithRouter } from "test-utils";
import { useLocation } from "@reach/router";

// Header is mocked globally in setup
const { Header } = jest.requireActual("./Header");

describe("Header", () => {
	beforeEach(() => {
		jest.restoreAllMocks();

		// The useLocation is mocked globally but because we're using renderWithRouter here
		// (ie with a LocationProvider) we want to use the actual implementation of useLocation
		(useLocation as jest.Mock).mockImplementation(() =>
			jest.requireActual("@reach/router").useLocation()
		);

		// Global nav uses a fetch to load autocomplete suggestions, and changing the input value triggers this fetch
		fetchMock.mockResponseOnce(JSON.stringify([]));

		const contentStart = document.createElement("div");
		contentStart.id = "content-start";
		document.body.appendChild(contentStart);
	});

	it("should render global nav with CKS highlighted in the nav", async () => {
		renderWithRouter(<Header />);

		const cksAnchor = await screen.findByText(
			(_content, element) =>
				element?.textContent ===
				// Odd spacing because of the nested spans inside global nav
				"CKS Clinical Knowledge SummariesClinical Knowledge Summaries",
			{ selector: "a" }
		);

		expect(cksAnchor.getAttribute("aria-current")).toBe("true");
	});

	it("should hide authentication", async () => {
		renderWithRouter(<Header />);

		await waitFor(() => {
			expect(screen.queryByText("Sign in")).toBeFalsy();
		});
	});

	it("should set placeholder attribute on search input", async () => {
		renderWithRouter(<Header />);

		expect(await screen.findByRole("combobox")).toHaveAttribute(
			"placeholder",
			"Search CKS…"
		);
	});

	it("should use gatsby navigate when clicking a global nav link with a relative url", async () => {
		renderWithRouter(<Header />);

		fireEvent.click(await screen.findByText("About CKS"), { button: 0 });

		await waitFor(
			() => {
				expect(navigate).toHaveBeenCalledWith("/about/");
			},
			{ timeout: 2500 }
		);
	});

	it("should set search box default value from q querystring value", async () => {
		renderWithRouter(<Header />, {
			route: "/search/?q=diabetes",
		});

		expect(await screen.findByRole("combobox")).toHaveAttribute(
			"value",
			"diabetes"
		);
	});

	it("should update search box value from q querystring value when URL changes", async () => {
		const { history } = renderWithRouter(<Header />, {
			route: "/search/?q=diabetes",
		});

		const searchBox = await screen.findByRole("combobox");
		await history.navigate("/search/?q=cancer");

		await waitFor(() => expect(searchBox).toHaveAttribute("value", "cancer"));
	});

	it("should use gatsby navigate with encoded query when submitting search form", async () => {
		renderWithRouter(<Header />);

		const searchBox = (await screen.findByRole("combobox")) as HTMLInputElement;
		searchBox.value = "diabetes 20%";

		fireEvent.submit(await screen.findByRole("search"));

		expect(navigate).toHaveBeenCalledWith("/search/?q=diabetes%2020%25");
	});
});
