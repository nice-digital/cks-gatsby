import { getSelector } from "../selectors";

/**
 * Waits for the search results page to have loaded, and the results to have been rendered.
 * We render search results client side, loaded via an AJAX request, so we have to wait for the async request to finish.
 * @param {int} timeoutMs The timeout, in milliseconds, to wait. Note it's a large timeout because the first search request takes a while inside docker.
 */
module.exports = (timeoutMs = 30000) => {
	// TODO Work out why the first search request takes ages inside docker, and then reduce this timeout
	browser.waitForVisible(getSelector("search results page"), timeoutMs);
};
