/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, waitFor, cleanup } from "@testing-library/react";

import { SEO } from "./SEO";

// Shouldn't need a timeout this big, but tests sometimes fail without it
const timeout = 4000;

describe("SEO", () => {
	afterEach(() => {
		cleanup();
	});

	it("should set HTML language to UK English", async () => {
		render(<SEO title="Custom title" description="Custom description" />);
		await waitFor(() => {
			expect(document.querySelector("html")?.getAttribute("lang")).toEqual(
				"en-GB"
			);
		});
	});

	it("should set default title and description when none provided", async () => {
		render(<SEO />);

		await waitFor(
			() => {
				expect(
					document
						.querySelector("meta[property='og:title']")
						?.getAttribute("content")
				).not.toBeUndefined();
			},
			{ timeout }
		);

		expect(document.querySelector("head")).toMatchSnapshot();
	});

	it("should render custom title and description in document head", async () => {
		render(<SEO title="Custom title" description="Custom description" />);
		await waitFor(
			() => {
				expect(
					document
						.querySelector("meta[property='og:title']")
						?.getAttribute("content")
				).toEqual("Custom title | CKS | NICE");
			},
			{ timeout }
		);

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

	it("should render robots when noIndex is set to true", async () => {
		render(<SEO noIndex={true} />);
		await waitFor(() => {
			expect(document.querySelector("meta[name='robots']")).toHaveAttribute(
				"content",
				"noindex"
			);
		});
	});

	it("should not render robots when noIndex is set to false", async () => {
		render(<SEO noIndex={false} />);
		await waitFor(() => {
			expect(document.querySelector("meta[name='robots']")).toBeNull();
		});
	});

	it("should not render robots when noIndex is not set", async () => {
		render(<SEO />);
		await waitFor(() => {
			expect(document.querySelector("meta[name='robots']")).toBeNull();
		});
	});
});
