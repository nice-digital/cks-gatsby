import React from "react";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "test-utils";

import { Layout } from "./Layout";

describe("Layout", () => {
	it("should have skip link target id on main element", async () => {
		renderWithRouter(<Layout>Test</Layout>);

		expect(screen.getByRole("main")).toHaveAttribute("id", "content-start");
	});
});
