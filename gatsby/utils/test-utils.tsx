import React, { ReactElement } from "react";
import { render, RenderResult, MatcherFunction } from "@testing-library/react";
import {
	createMemorySource,
	createHistory,
	LocationProvider,
	History,
} from "@reach/router";

export type RenderWithRouterResult = { history: History } & RenderResult;

// Util for rendering a component wrapped within Reach Router's LocationProvider
// See https://testing-library.com/docs/example-reach-router
export const renderWithRouter = (
	ui: ReactElement,
	{ route = "/", history = createHistory(createMemorySource(route)) } = {}
): RenderWithRouterResult => ({
	...render(<LocationProvider history={history}>{ui}</LocationProvider>),
	// adding `history` to the returned utilities to allow us
	// to reference it in our tests (just try to avoid using
	// this to test implementation details).
	history,
});

export const textContentMatcher =
	(text: string): MatcherFunction =>
	(_, element): boolean =>
		element?.textContent?.trim() == text;
