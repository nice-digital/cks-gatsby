import React from "react";
import { render, waitFor, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Speciality } from "../../types";

import SpecialityPage, { SpecialityPageProps } from "./Speciality";
import { textContentMatcher } from "test-utils";
import { navigate } from "gatsby";

const getDefaultSpecialityTestData = (): Speciality => ({
	id: "spec123",
	name: "Allergies",
	slug: "allergies",
	topics: [
		// Note: this topic list test data is deliberately NOT in alphabetic order, so we can test the ordering
		{
			id: "topic2",
			slug: "angio-oedema-and-anaphylaxis",
			topicName: "Angio-oedema and anaphylaxis",
			topicId: "41b219ac-b62a-42d3-9d76-7b3897b21bdd",
			aliases: [],
		},
		{
			id: "topic1",
			slug: "allergic-rhinitis",
			topicName: "Allergic rhinitis",
			topicId: "0473d89c-2999-40d1-911f-d265b4bd3942",
			aliases: [],
		},
	],
});

describe("SpecialityPage", () => {
	let speciality: Speciality = getDefaultSpecialityTestData(),
		renderResult: RenderResult;

	beforeEach(() => {
		renderResult = render(
			<SpecialityPage {...({ data: { speciality } } as SpecialityPageProps)} />
		);
	});

	afterEach(() => {
		speciality = getDefaultSpecialityTestData();
	});

	describe("SEO", () => {
		it("should render the speciality name in the page title", async () => {
			await waitFor(() => {
				expect(document.title).toContain("Allergies | Specialities");
			});
		});

		it("should set meta description with multiple topics", async () => {
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute(
					"content",
					"Speciality allergies, containing practical guidance on best practice for 2 primary care topics"
				);
			});
		});

		describe("", () => {
			beforeAll(() => {
				speciality.topics = speciality.topics.slice(0, 1);
			});
			it("should set meta description with single topic", async () => {
				await waitFor(() => {
					expect(
						document.querySelector("meta[name='description']")
					).toHaveAttribute(
						"content",
						"Speciality allergies, containing practical guidance on best practice for 1 primary care topic"
					);
				});
			});
		});
	});

	describe("Breadcrumbs", () => {
		it.each([
			["NICE", "https://www.nice.org.uk/"],
			["CKS", "/"],
			["Specialities", "/specialities/"],
		])("Breadcrumbs (%s)", (breadcrumbText, expectedHref) => {
			expect(
				renderResult.queryByText(textContentMatcher(breadcrumbText), {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", expectedHref);
		});

		it("should render speciality as current page breadcrumb without link", () => {
			const { queryByText } = renderResult;

			expect(
				queryByText(textContentMatcher("Allergies"), {
					selector: ".breadcrumbs span",
				})
			).toBeTruthy();
		});
	});

	describe("Page header", () => {
		it("should render heading 1 with speciality name", () => {
			expect(
				renderResult.queryByText("Allergies", {
					selector: "h1",
				})
			).toBeInTheDocument();
		});
	});

	describe("Topic list", () => {
		it("should render labelled ordered list", () => {
			expect(
				renderResult.getByLabelText("A to Z of topics within Allergies").tagName
			).toBe("OL");
		});

		it("should render topics alphabetically as list items", () => {
			const listItems = renderResult.getByLabelText(
				"A to Z of topics within Allergies"
			).children;
			expect(listItems).toHaveLength(2);
			expect(listItems[0].textContent).toBe("Allergic rhinitis");
			expect(listItems[1].textContent).toBe("Angio-oedema and anaphylaxis");
		});

		it("should render link to topic page for each topic", () => {
			const topicAnchor = renderResult.getByText("Allergic rhinitis", {
				selector: "ol a",
			});

			expect(topicAnchor).toHaveAttribute("href", "/topics/allergic-rhinitis/");
		});

		it("should user Gatsby's client side navigation for topic links", () => {
			const allergicRhinitisAnchor = renderResult.getByText(
				"Allergic rhinitis",
				{
					selector: "ol a",
				}
			);

			userEvent.click(allergicRhinitisAnchor);

			expect(navigate).toHaveBeenCalledWith("/topics/allergic-rhinitis/");
		});
	});
});
