import React from "react";
import { fireEvent, wait } from "@testing-library/react";
import { navigate } from "gatsby";
import { renderWithRouter } from "test-utils";

import { Header } from "./Header";

describe("Header", () => {
	it("should render global nav with CKS highlighted in the nav", async () => {
		const { findByText } = renderWithRouter(<Header />);

		const cksAnchor = await findByText(
			(_content, element) => element.textContent === "CKS",
			{ selector: "a" }
		);

		expect(cksAnchor.getAttribute("aria-current")).toBe("true");
	});

	it("should hide authentication", async () => {
		const { queryByText } = renderWithRouter(<Header />);

		await wait(async () => {
			expect(await queryByText("Sign in")).toBeFalsy();
		});
	});

	it("should set placeholder attribute on search input", async () => {
		const { findByRole } = renderWithRouter(<Header />);

		expect(await findByRole("searchbox")).toHaveAttribute(
			"placeholder",
			"Search CKS…"
		);
	});

	it("should use gatsby navigate when clicking a global nav link with a relative url", async () => {
		const { findByText } = renderWithRouter(<Header />);

		fireEvent.click(await findByText("About CKS"), { button: 0 });

		wait(() => expect(navigate).toHaveBeenCalledWith("/about"));
	});

	it("should set search box default value from q querystring value", async () => {
		const { findByRole } = renderWithRouter(<Header />, {
			route: "/search?q=diabetes",
		});

		expect(await findByRole("searchbox")).toHaveAttribute("value", "diabetes");
	});

	it("should update search box value from q querystring value when URL changes", async () => {
		const { findByRole, history } = renderWithRouter(<Header />, {
			route: "/search?q=diabetes",
		});

		const searchBox = await findByRole("searchbox");
		await history.navigate("/search?q=cancer");

		await wait(() => expect(searchBox).toHaveAttribute("value", "cancer"));
	});

	it("should use gatsby navigate when submitting search form", async () => {
		const { findByRole } = renderWithRouter(<Header />);

		const searchBox = (await findByRole("searchbox")) as HTMLInputElement;
		searchBox.value = "diabetes";

		fireEvent.submit(await findByRole("search"));

		expect(navigate).toHaveBeenCalledWith("/search?q=diabetes");
	});
});
