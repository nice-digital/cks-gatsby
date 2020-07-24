import React from "react";

import { renderWithRouter, RenderWithRouterResult } from "test-utils";
import IndexPage from "../index";

const specialities = [
	{
		id: "86ae217e-d675-5678-91c5-7bfbaa88c2f1",
		name: "Injuries",
		slug: "injuries",
	},
	{
		id: "f8332083-731e-50fe-a895-030315ce6083",
		name: "Musculoskeletal",
		slug: "musculoskeletal",
	},
	{
		id: "50071c38-ab10-5ab8-ac70-6bd19a96c24e",
		name: "Skin and nail",
		slug: "skin-and-nail",
	},
];

const topics = [
	"Achilles tendinopathy",
	"Back pain - low (without radiculopathy)",
	"DMARDs",
];

describe("Home page", () => {
	let renderResult: RenderWithRouterResult;
	beforeEach(() => {
		renderResult = renderWithRouter(
			<IndexPage
				data={{
					allSpecialities: { nodes: specialities },
					allCksTopic: { distinct: topics },
				}}
			/>
		);
	});

	it("should render the titles with the expected text", () => {
		const { queryByText } = renderResult;
		expect(queryByText("Clinical Knowledge Summaries")?.tagName).toBe("H1");
		expect(queryByText("Health topics A to Z")?.tagName).toBe("H2");
		expect(queryByText("Specialties")?.tagName).toBe("H2");
	});

	describe("Topic list", () => {
		it("should render an A-Z link for any topics that begin with that letter", () => {
			const { queryByText } = renderResult;
			expect(queryByText("A")?.tagName).toBe("A");
			expect(queryByText("B")?.tagName).toBe("A");
			expect(queryByText("D")?.tagName).toBe("A");
		});

		it("should not provide an A-Z link if there are no topics beginning with that letter", () => {
			const { queryByText } = renderResult;
			expect(queryByText("C")?.tagName).toBe("SPAN");
		});
	});

	describe("Specialty list", () => {
		it("should show any supplied specialities", () => {
			const { queryByText } = renderResult;
			specialities.map(({ name }) => {
				expect(queryByText(name)).toBeInTheDocument();
			});
		});
	});
});
