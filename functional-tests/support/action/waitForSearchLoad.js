import { getSelector } from "../selectors";

/**
 * Waits for the search results page to have loaded, and the results to have been rendered.
 * We render search results client side, loaded via an AJAX request, so we have to wait for the async request to finish.
 * @param {int} timeoutMs The timeout, in milliseconds, to wait
 */
module.exports = (timeoutMs = 5000) => {
	browser.waitForVisible(getSelector("search results page"), timeoutMs);
};
