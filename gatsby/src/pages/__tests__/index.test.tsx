import React from "react";
import { render } from "@testing-library/react";

import IndexPage from "../index";

describe("index", () => {
	it("should match snapshot", () => {
		const { container } = render(
			<IndexPage data={{ allTopics: { nodes: [] } }} />
		);

		expect(container.firstChild).toMatchSnapshot();
	});

	it("should render h1 with correct text", () => {
		const { getByRole } = render(
			<IndexPage data={{ allTopics: { nodes: [] } }} />
		);

		expect(getByRole("heading")).toHaveTextContent("Index page");
	});
});
