/* eslint-disable testing-library/no-node-access */
import React from "react";
import { textContentMatcher } from "test-utils";
import { render, screen } from "@testing-library/react";

import AboutPage from "../";

describe("About page", () => {
	beforeEach(() => {
		// eslint-disable-next-line testing-library/no-render-in-setup
		render(<AboutPage />);
	});

	describe("Breadcrumbs", () => {
		it("should render NICE homepage breadcrumb link", () => {
			expect(
				screen.queryByText(textContentMatcher("NICE"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "https://www.nice.org.uk/");
		});

		it("should render CKS home breadcrumb", () => {
			expect(
				screen.queryByText(textContentMatcher("CKS"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render current page breadcrumb without link", () => {
			expect(
				screen.getByText(textContentMatcher("About CKS"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with About CKS", () => {
			expect(
				screen.queryByText("About CKS", {
					selector: "h1",
				})?.tagName
			).toBe("H1");
		});
	});

	describe("Body", () => {
		it("should match snapshot for 'Help develop CKS' panel", () => {
			expect(
				screen.getByText("Help develop CKS").parentElement
			).toMatchSnapshot();
		});

		it("should match snapshot for main body content", () => {
			expect(
				screen.getByText("Quick answers to clinical questions").parentElement
			).toMatchSnapshot();
		});
	});
});
