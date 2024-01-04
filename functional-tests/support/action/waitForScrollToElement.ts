import { isAtTopOfScreen } from "./isAtTopOfScreen.js";
import { windowIsScrolledToBottom } from "./windowIsScrolledToBottom.js";

/**
 * Waits for the given element to be scrolled to.
 * The wait is required as we're using smooth scrolling.
 *
 * @param {String} selector
 * @param {Number} timeoutMs Timeout for waiting, in milliseconds
 */
export async function waitForScrollToElement(
	selector: string,
	timeout = 5000,
	contextSelector?: string
): Promise<void> {
	await browser.waitUntil(
		async () =>
			(await isAtTopOfScreen(selector, contextSelector)) ||
			(await windowIsScrolledToBottom()),
		{
			timeout,
			timeoutMsg: `Element ${selector} is not visible after scrolling after ${timeout}ms`,
		}
	);
}
