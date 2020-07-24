import isVisible from "./isVisible";
import isAtTopOfScreen from "./isAtTopOfScreen";
import windowIsScrolledToBottom from "./windowIsScrolledToBottom";

/**
 * Waits for the given element to be scrolled to.
 * The wait is required as we're using smooth scrolling.
 *
 * @param {String} selector
 * @param {Number} timeoutMs Timeout for waiting, in milliseconds
 */
module.exports = (selector, timeoutMs = 5000) => {
	browser.waitUntil(
		() => isAtTopOfScreen(selector) || windowIsScrolledToBottom(),
		timeoutMs,
		`Element ${selector} is not visible after scrolling after ${timeoutMs}ms`
	);
};
