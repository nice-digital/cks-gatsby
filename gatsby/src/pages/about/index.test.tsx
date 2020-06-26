import React from "react";
import { textContentMatcher } from "test-utils";
import { render, RenderResult } from "@testing-library/react";

import AboutPage from ".";

describe("About page", () => {
	let renderResult: RenderResult;

	beforeEach(() => {
		renderResult = render(<AboutPage />);
	});

	describe("Breadcrumbs", () => {
		it("should render NICE homepage breadcrumb link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("NICE"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "https://www.nice.org.uk/");
		});

		it("should render CKS home breadcrumb", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("CKS"), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/");
		});

		it("should render current page breadcrumb without link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("About CKS"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with About CKS", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText("About CKS", {
					selector: "h1",
				})?.tagName
			).toBe("H1");
		});
	});

	describe("Body", () => {
		it("should match snapshot for 'Help develop CKS' panel", () => {
			expect(
				renderResult.getByText("Help develop CKS").parentElement
			).toMatchSnapshot();
		});

		it("should match snapshot for main body content", () => {
			expect(
				renderResult.getByText("Quick answers to clinical questions")
					.parentElement
			).toMatchSnapshot();
		});
	});
});
