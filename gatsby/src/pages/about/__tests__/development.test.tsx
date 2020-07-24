import React from "react";
import { textContentMatcher } from "test-utils";
import { render, RenderResult, waitFor } from "@testing-library/react";

import DevelopmentPage from "../development";

describe("Development page", () => {
	let renderResult: RenderResult;

	beforeEach(() => {
		renderResult = render(<DevelopmentPage />);
	});

	describe("SEO", () => {
		it("should set page title", async () => {
			await waitFor(() => {
				expect(document.title).toContain("Development process | About CKS");
			});
		});

		it("should set meta description", async () => {
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute(
					"content",
					"The CKS development process, including new topics, topic updates and the CKS process guide"
				);
			});
		});
	});

	describe("Breadcrumbs", () => {
		it.each([
			["NICE", "https://www.nice.org.uk/"],
			["CKS", "/"],
			["About CKS", "/about/"],
		])("Breadcrumbs (%s)", (breadcrumbText, expectedHref) => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render current page breadcrumb without link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("Development process"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with Development process", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText("Development process", {
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

		it("should match snapshot for 'CKS process guide' panel", () => {
			expect(
				renderResult.getByText("CKS process guide").parentElement
			).toMatchSnapshot();
		});

		it("should match snapshot for main body content", () => {
			expect(
				renderResult.getByText("New topics").parentElement
			).toMatchSnapshot();
		});
	});
});
