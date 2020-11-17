import React from "react";
import { waitFor, RenderResult, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { textContentMatcher } from "test-utils";

import SpecialitiesPage, { SpecialitiesPageProps } from "../specialities";
import { PartialSpeciality } from "src/types";
import { navigate } from "gatsby";

describe("SpecialitiesPage", () => {
	const specialities: PartialSpeciality[] = [
		{
			id: "a1",
			name: "Allergies",
			slug: "allergies",
		},
		{
			id: "b2",
			name: "Cancer",
			slug: "cancer",
		},
	];

	let renderResult: RenderResult;
	beforeEach(() => {
		renderResult = render(
			<SpecialitiesPage
				{...({
					data: {
						allSpecialities: { nodes: specialities },
					},
				} as SpecialitiesPageProps)}
			/>
		);
	});

	describe("SEO", () => {
		it("should render specialities in the page title", async () => {
			await waitFor(() => {
				expect(document.title).toContain("Specialities | ");
			});
		});
	});

	describe("Breadcrumbs", () => {
		it.each([
			["NICE", "https://www.nice.org.uk/"],
			["CKS", "/"],
		])("Breadcrumbs (%s)", (breadcrumbText, expectedHref) => {
			expect(
				renderResult.queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render specialities as current page breadcrumb without link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("Specialities"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with speciality name", () => {
			expect(
				renderResult.queryByText("Specialities", {
					selector: "h1",
				})
			).toBeInTheDocument();
		});
		it("should render lead paragraph", () => {
			expect(
				renderResult.queryByText(
					"There are over 370 topics, with focus on the most common and significant presentations in primary care."
				)
			).toBeInTheDocument();
		});
	});

	describe("Speciality list", () => {
		it("should render labelled ordered list", () => {
			expect(
				renderResult.getByLabelText("A to Z of specialities").tagName
			).toBe("OL");
		});

		it("should render specialities as list items", () => {
			const listItems = renderResult.getByLabelText("A to Z of specialities")
				.children;
			expect(listItems).toHaveLength(2);
			expect(listItems[0].textContent).toBe("Allergies");
			expect(listItems[1].textContent).toBe("Cancer");
		});

		it("should render link to speciality page for each speciality", () => {
			const specialityAnchor = renderResult.getByText("Allergies", {
				selector: "ol a",
			});

			expect(specialityAnchor).toHaveAttribute(
				"href",
				"/specialities/allergies/"
			);
		});

		it("should user Gatsby's client side navigation for speciality links", () => {
			const allergiesAnchor = renderResult.getByText("Allergies", {
				selector: "ol a",
			});

			userEvent.click(allergiesAnchor);

			expect(navigate).toHaveBeenCalledWith("/specialities/allergies/");
		});
	});
});
