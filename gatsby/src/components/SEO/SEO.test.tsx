import React from "react";
import { render, waitForDomChange } from "@testing-library/react";

import { SEO } from "./SEO";

describe("SEO", () => {
	it("should set HTML language to UK English", async () => {
		render(<SEO title="Custom title" description="Custom description" />);
		await waitForDomChange();
		expect(document.querySelector("html")?.getAttribute("lang")).toEqual(
			"en-GB"
		);
	});

	it("should set default title and description when none provided", async () => {
		render(<SEO />);

		await waitForDomChange();

		expect(document.querySelector("head")).toMatchSnapshot();
	});

	it("should render custom title and description in document head", async () => {
		render(<SEO title="Custom title" description="Custom description" />);
		await waitForDomChange();

		expect(document.title).toEqual("Custom title | CKS | NICE");
		expect(
			document
				.querySelector("meta[property='og:title']")
				?.getAttribute("content")
		).toEqual("Custom title | CKS | NICE");
		expect(
			document
				.querySelector("meta[name='description']")
				?.getAttribute("content")
		).toEqual("Custom description");
		expect(
			document
				.querySelector("meta[property='og:description']")
				?.getAttribute("content")
		).toEqual("Custom description");
	});
});
