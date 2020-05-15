import React from "react";
import { render } from "@testing-library/react";

import { Footer } from "./Footer";

describe("Footer", () => {
	it("should render global nav", async () => {
		const { findByText } = render(<Footer />);

		expect(await findByText("NICE Pathways")).toBeInTheDocument();
	});
});
