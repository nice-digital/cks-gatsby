import React from "react";
import { waitFor, render, screen } from "@testing-library/react";
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

	beforeEach(() => {
		render(
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
				screen.queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render specialities as current page breadcrumb without link", () => {
			expect(
				screen.getByText(textContentMatcher("Specialities"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with speciality name", () => {
			expect(
				screen.getByText("Specialities", {
					selector: "h1",
				})
			).toBeInTheDocument();
		});
		it("should render lead paragraph", () => {
			expect(
				screen.getByText(
					"There are over 370 topics, with focus on the most common and significant presentations in primary care."
				)
			).toBeInTheDocument();
		});
	});

	describe("Speciality list", () => {
		it("should render labelled ordered list", () => {
			expect(screen.getByLabelText("A to Z of specialities").tagName).toBe(
				"OL"
			);
		});

		it("should render specialities as list items", () => {
			const listItems =
				// eslint-disable-next-line testing-library/no-node-access
				screen.getByLabelText("A to Z of specialities").children;
			expect(listItems).toHaveLength(2);
			expect(listItems[0].textContent).toBe("Allergies");
			expect(listItems[1].textContent).toBe("Cancer");
		});

		it("should render link to speciality page for each speciality", () => {
			const specialityAnchor = screen.getByText("Allergies", {
				selector: "ol a",
			});

			expect(specialityAnchor).toHaveAttribute(
				"href",
				"/specialities/allergies/"
			);
		});

		it("should user Gatsby's client side navigation for speciality links", async () => {
			const user = userEvent.setup();
			const allergiesAnchor = screen.getByText("Allergies", {
				selector: "ol a",
			});

			user.click(allergiesAnchor);

			await waitFor(() =>
				expect(navigate).toHaveBeenCalledWith("/specialities/allergies/")
			);
		});
	});
});
