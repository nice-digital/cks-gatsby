import React from "react";
import { render, screen } from "@testing-library/react";
import { Layout } from "./Layout";

describe("Layout", () => {
	it("should match snapshot for EULA", () => {
		render(<Layout>Test</Layout>);

		expect(screen.getByTestId("eula")).toMatchSnapshot();
	});
});
