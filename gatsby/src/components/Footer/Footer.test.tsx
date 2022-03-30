import React from "react";
import { render, screen } from "@testing-library/react";

// Footer is mocked globally in setup
const { Footer } = jest.requireActual("./Footer");

describe("Footer", () => {
	it("should render global nav", async () => {
		render(<Footer />);

		expect(await screen.findByText("Life sciences")).toBeInTheDocument();
	});
});
