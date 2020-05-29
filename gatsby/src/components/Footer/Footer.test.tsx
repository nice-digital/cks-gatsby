import React from "react";
import { render } from "@testing-library/react";

// Footer is mocked globally in setup
const { Footer } = jest.requireActual("./Footer");

describe("Footer", () => {
	it("should render global nav", async () => {
		const { findByText } = render(<Footer />);

		expect(await findByText("NICE Pathways")).toBeInTheDocument();
	});
});
