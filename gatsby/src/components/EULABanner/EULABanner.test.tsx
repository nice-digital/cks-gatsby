import React from "react";
import { render, screen } from "@testing-library/react";

import { EULABanner } from "./EULABanner";
import Cookies from "js-cookie";

describe("EULABanner", () => {
	it("should match snapshot", () => {
		Cookies.get = jest.fn().mockImplementationOnce(() => undefined);
		render(<EULABanner />);
		expect(document.body).toMatchSnapshot();
	});

	it("should render the EULABanner content", () => {
		Cookies.get = jest.fn().mockImplementationOnce(() => undefined);
		render(<EULABanner />);
		expect(
			screen.getByText("CKS End User Licence Agreement")
		).toBeInTheDocument();
	});

	it("should show the EULABanner if there is no cookie present", () => {
		Cookies.get = jest.fn().mockImplementationOnce(() => undefined);
		render(<EULABanner />);
		const banner = screen.getByRole("dialog");
		expect(banner).toBeInTheDocument();
		expect(banner).toHaveAttribute("data-state", "open");
	});

	it("should not show the EULABanner if there is a cookie present", () => {
		Cookies.get = jest.fn().mockImplementationOnce(() => "true");
		render(<EULABanner />);
		const banner = screen.queryByRole("dialog");
		expect(banner).not.toBeInTheDocument();
	});
});
