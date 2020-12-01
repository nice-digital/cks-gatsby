// URL is global in Node 10 and above but needs an explicit import for Node 8
const URL = require("url").URL;

import {
	path as whatsNewPath,
	selectors as whatsNewSelectors,
} from "./pages/whats-new";

import {
	path as searchPath,
	selectors as searchSelectors,
} from "./pages/search";

import commonSelectors from "./common";

// Map of path regular expression to selectors
const pageMappings = [
	{
		path: whatsNewPath,
		selectors: whatsNewSelectors,
	},
	{
		path: searchPath,
		selectors: searchSelectors,
	},
];

export const getSelector = (selectorName) => {
	const browserPath = new URL(browser.getUrl()).pathname,
		pageMapping = pageMappings.find(({ path }) =>
			typeof path === "string" ? path === browserPath : path.test(browserPath)
		),
		pageSelectors = pageMapping && pageMapping.selectors,
		selectors = Object.assign({}, commonSelectors, pageSelectors),
		selector = selectors[selectorName];

	if (!selector)
		throw new Error(
			`No selector found with name ${selectorName} for page ${browserPath} or in common selectors`
		);

	return selector;
};
