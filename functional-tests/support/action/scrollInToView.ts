import { waitForScrollToElement } from "./waitForScrollToElement.js";

import { checkIfElementExists } from "../check/checkIfElementExists.js";

const scrollIntoViewNICE = (
	selector: string,
	contextSelector?: string
): number => {
	let element: Element;
	if (selector.indexOf("=") > -1) {
		// WDIO selectors can be in the form TAG=TEXT so parse these out into xpath
		// selectors so we can execute this in the browser

		const parts = selector.split("="),
			tag = parts[0] || "*",
			text = parts[1],
			xPath = `.//${tag}[normalize-space() = "${text}"]`;
		element = document.evaluate(
			xPath,
			contextSelector
				? document.querySelector(contextSelector) || document
				: document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue as Element;
		(element as HTMLElement).scrollIntoView();
	} else {
		element = (
			contextSelector
				? document.querySelector(contextSelector)?.querySelector(selector)
				: document.querySelector(selector)
		) as Element;
		element.scrollIntoView();
	}

	return 0;
};

export async function scrollNow(
	selector: string,
	contextSelector?: string
): Promise<boolean> {
	await checkIfElementExists(selector);

	await browser.execute(scrollIntoViewNICE, selector, contextSelector);

	return true;
}

/**
 * Waits for the given element to be scrolled to.
 * The wait is required as we're using smooth scrolling.
 *
 * @param {String} selector
 * @param {Number} timeoutMs Timeout for waiting, in milliseconds
 */
export async function scrollIntoView(
	selector: string,
	contextSelector?: string
): Promise<void> {
	await browser.waitUntil(
		async () => await scrollNow(selector, contextSelector)
	);
}

export async function scrollInToView(
	selector: string,
	contextSelector?: string
) {
	await checkIfElementExists(selector);

	const element = contextSelector
		? await (await $(contextSelector)).$(selector)
		: await $(selector);

	// TODO: Why do we need to pause here? For some reason the scrollIntoView call below doesn't always work.
	// it _might_ be conflicting with scroll restoration in Gatsby https://www.gatsbyjs.com/docs/how-to/routing/scroll-restoration/
	await browser.pause(250);

	await scrollIntoView(selector, contextSelector);
	await waitForScrollToElement(selector, 5000, contextSelector);
}
