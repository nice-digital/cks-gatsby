import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import {
	EULABanner,
	COOKIE_CONTROL_NAME,
	EULA_COOKIE_NAME,
	COOKIE_EXPIRY,
} from "./EULABanner";
import Cookies from "js-cookie";

jest.mock("js-cookie");

const mockCookiesGet = (
	cookieControl: boolean | undefined,
	eulaAccepted: boolean | undefined
) => {
	Cookies.get = jest.fn().mockImplementation((name) => {
		if (name === COOKIE_CONTROL_NAME) return cookieControl;
		if (name === EULA_COOKIE_NAME) return eulaAccepted;
		return undefined;
	});
};

describe("EULABanner", () => {
	it("should match snapshot", () => {
		mockCookiesGet(true, undefined);
		render(<EULABanner />);
		expect(document.body).toMatchSnapshot();
	});

	it("should render the EULABanner if the CookieControl is set and no cookie banner displayed", () => {
		mockCookiesGet(true, undefined);
		render(<EULABanner />);
		expect(
			screen.getByText("CKS End User Licence Agreement")
		).toBeInTheDocument();
	});

	test("observes cookie banner dismissal and shows EULA banner", () => {
		const MockCookieBannerRegion = document.createElement("div");
		MockCookieBannerRegion.setAttribute("role", "region");

		const MockCookieBannerElement = document.createElement("div");
		MockCookieBannerElement.classList.add("ccc-module--slideout");

		MockCookieBannerRegion.appendChild(MockCookieBannerElement);
		document.body.appendChild(MockCookieBannerRegion);

		mockCookiesGet(true, undefined);
		render(<EULABanner />);

		expect(
			screen.queryByText("CKS End User Licence Agreement")
		).not.toBeInTheDocument();

		document.body.innerHTML = "";
	});

	test("sets EULA cookie and closes banner on accept", () => {
		mockCookiesGet(true, undefined);

		render(<EULABanner />);
		const acceptButton = screen.getByText("I accept these terms");
		fireEvent.click(acceptButton);
		expect(Cookies.set).toHaveBeenCalledWith("CKS-EULA-Accepted", "true", {
			expires: COOKIE_EXPIRY,
		});
		expect(
			screen.queryByText("CKS End User Licence Agreement")
		).not.toBeInTheDocument();
	});

	it("should not show the EULABanner if there is a EULA cookie present", () => {
		mockCookiesGet(true, true);
		render(<EULABanner />);
		const banner = screen.queryByRole("dialog");
		expect(banner).not.toBeInTheDocument();
	});
});
