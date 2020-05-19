import React from "react";
import { renderWithRouter } from "test-utils";

import { Layout } from "./Layout";

describe("Layout", () => {
	it("should have skip link target id on main element", async () => {
		const { getByRole } = renderWithRouter(<Layout>Test</Layout>);

		expect(getByRole("main")).toHaveAttribute("id", "content-start");
	});
});
