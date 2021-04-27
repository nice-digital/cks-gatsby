import React from "react";
import { render } from "@testing-library/react";

import { BackToTop } from "./BackToTop";

describe("BackToTop", () => {
	it("should match snapshot", () => {
		expect(render(<BackToTop />).container).toMatchSnapshot();
	});
});
