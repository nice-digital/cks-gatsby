import React from "react";

import { renderWithRouter } from "test-utils";
import IndexPage from "../index";

describe("index", () => {
	it("should match snapshot", () => {
		const { container } = renderWithRouter(
			<IndexPage data={{ allTopics: { nodes: [] } }} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it("should render h1 with correct text", () => {
		const { queryByText } = renderWithRouter(
			<IndexPage data={{ allTopics: { nodes: [] } }} />
		);

		expect(queryByText("Clinical Knowledge Summaries")?.tagName).toBe("H1");
	});
});
