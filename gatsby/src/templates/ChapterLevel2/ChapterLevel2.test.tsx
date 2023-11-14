/* eslint-disable testing-library/no-node-access */
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChapterLevel2Page, { ChapterLevel2PageProps } from "./ChapterLevel2";
import { ChapterLevel2, PartialChapter } from "../../types";

describe("ChapterLevel2", () => {
	let chapter: ChapterLevel2;
	beforeEach(() => {
		chapter = {
			id: "abc123",
			fullItemName: "Definition",
			depth: 2,
			slug: "definition",
			htmlHeader:
				"<!-- begin field 336bea12-ae71-45cd-95f0-7a209ba6e39d --><h2>What is it?</h2><!-- end field 336bea12-ae71-45cd-95f0-7a209ba6e39d -->",
			htmlStringContent:
				"<strong>Asthma is a chronic respiratory condition associated with airway inflammation and hyper-responsiveness</strong>",
			parentChapter: {
				fullItemName: "Background information",
				slug: "background-information",
			},
			subChapters: [
				{
					id: "def456",
					slug: "basis-for-recommendation",
					fullItemName: "Basis for recommendation",
					htmlHeader:
						"<!-- begin field b057a366-bb8a-4948-9c8e-a6be01014b6e --><h3>Basis for recommendation</h3><!-- end field b057a366-bb8a-4948-9c8e-a6be01014b6e -->",
					depth: 3,
					htmlStringContent:
						"<p>The recommendations on diagnosis of asthma&nbsp;are based on expert opinion in the British Thoracic Society (BTS)</p>",
					subChapters: [] as PartialChapter[],
				} as ChapterLevel2,
			],
			topic: {
				topicName: "Asthma",
				slug: "asthma",
				lastRevised: "Last revised in April&nbsp;2020",
				chapters: [
					{
						id: "smry",
						fullItemName: "Summary",
						subChapters: [] as PartialChapter[],
					} as PartialChapter,
				],
			},
		} as ChapterLevel2;
	});

	describe("Breadcrumbs", () => {
		it("should have homepage breadcrumb", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);

			expect(
				screen.getByText("CKS", { selector: ".breadcrumbs a" })
			).toHaveAttribute("href", "/");
		});

		it("should have parent topic breadcrumb", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);

			expect(
				screen.getByText("Asthma", { selector: ".breadcrumbs a" })
			).toHaveAttribute("href", "/topics/asthma/");
		});

		it("should have parent chapter breadcrumb", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);

			expect(
				screen.getByText("Background information", {
					selector: ".breadcrumbs a",
				})
			).toHaveAttribute("href", "/topics/asthma/background-information/");
		});
	});

	describe("SEO", () => {
		it("should use fallback meta description when summary is empty", async () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute(
					"content",
					"Definition, Background information, Asthma, CKS"
				);
			});
		});

		it("should use summary field for meta description", async () => {
			chapter.summary = "this is some summary text";
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);
			await waitFor(() => {
				expect(
					document.querySelector("meta[name='description']")
				).toHaveAttribute("content", "this is some summary text");
			});
		});
	});

	describe("page header", () => {
		it("should render parent topic name with chapter name as heading 1", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);
			const heading = screen.getAllByRole("heading")[0];
			expect(heading).toHaveProperty("tagName", "H1");
			expect(heading).toHaveProperty("textContent", "Asthma: What is it?");
		});

		it("should render last revised text as lead paragraph", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);
			const lead = screen.getByText("Last revised in April 2020");
			expect(lead.parentElement).toHaveClass("page-header__lead");
		});
	});

	describe("print", () => {
		it("should render print button", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);

			expect(screen.getByText("Print this page")).toBeInTheDocument();
		});

		it("should print window on print button click", async () => {
			const user = userEvent.setup();
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);

			const oldPrint = global.print;
			const printSpy = jest.fn();
			global.print = printSpy;
			const printBtn = screen.getByText("Print this page");
			user.click(printBtn);

			await waitFor(() => expect(printSpy).toHaveBeenCalled());
			global.print = oldPrint;
		});
	});

	describe("title", () => {
		it("should have title with chapter name, parent chapter name and parent topic name", async () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);

			await waitFor(() => {
				expect(document.title).toEqual(
					"Definition | Background information | Asthma | CKS | NICE"
				);
			});
		});
	});

	describe("html string content", () => {
		it("should render html string content as chapter body", () => {
			render(
				<ChapterLevel2Page
					{...({ pageContext: { chapter } } as ChapterLevel2PageProps)}
				/>
			);
			expect(
				screen.getByLabelText("What is it?", {
					selector: "section",
				}).innerHTML
			).toContain(
				"<strong>Asthma is a chronic respiratory condition associated with airway inflammation and hyper-responsiveness</strong>"
			);
		});
	});
});
