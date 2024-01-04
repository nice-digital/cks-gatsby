import { getSelector } from "../selectors/index.js";

/**
 * Waits for the search results page to have loaded, and the results to have been rendered.
 * We render search results client side, loaded via an AJAX request, so we have to wait for the async request to finish.
 * @param {number} timeoutMs The timeout, in milliseconds, to wait. Note it's a large timeout because the first search request takes a while inside docker.
 */
export async function waitForSearchLoad(
	timeout: number = 30000
): Promise<void> {
	// TODO Work out why the first search request takes ages inside docker, and then reduce this timeout
	const selector = await getSelector("search results page"),
		element = await $(selector);
	await element.waitForDisplayed({ timeout });
}
