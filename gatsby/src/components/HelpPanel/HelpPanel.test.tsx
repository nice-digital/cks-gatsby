import React from "react";
import { render } from "@testing-library/react";

import { HelpPanel } from "./HelpPanel";

describe("HelpPanel", () => {
	it("should match snapshot", () => {
		expect(render(<HelpPanel />).container).toMatchSnapshot();
	});
});
