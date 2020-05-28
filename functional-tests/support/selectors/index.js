import {
	path as whatsNewPath,
	selectors as whatsNewSelectors,
} from "./pages/whats-new";

// Map of path regular expression to selectors
const pageMappings = [
	{
		path: whatsNewPath,
		selectors: whatsNewSelectors,
	},
];

export const getSelector = (selectorName) => {
	const browserPath = new URL(browser.getUrl()).pathname,
		pageMapping = pageMappings.find(({ path }) =>
			typeof path === "string" ? path === browserPath : path.test(browserPath)
		),
		pageSelectors = pageMapping && pageMapping.selectors,
		selectors = Object.assign({}, pageSelectors),
		selector = selectors[selectorName];

	if (!selector)
		throw new Error(
			`No selector found with name ${selectorName} for page ${browserPath} or in common selectors`
		);

	return selector;
};
