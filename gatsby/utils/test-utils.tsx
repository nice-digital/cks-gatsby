import React, { ReactElement } from "react";
import { render, RenderResult } from "@testing-library/react";
import {
	createMemorySource,
	createHistory,
	LocationProvider,
	History,
} from "@reach/router";

// Util for rendering a component wrapped within Reach Router's LocationProvider
// See https://testing-library.com/docs/example-reach-router
export const renderWithRouter = (
	ui: ReactElement,
	{ route = "/", history = createHistory(createMemorySource(route)) } = {}
): { history: History } & RenderResult => ({
	...render(<LocationProvider history={history}>{ui}</LocationProvider>),
	// adding `history` to the returned utilities to allow us
	// to reference it in our tests (just try to avoid using
	// this to test implementation details).
	history,
});
