import checkIfElementExists from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

import isVisible from "./isVisible";
import waitForScrollToElement from "./waitForScrollToElement";

module.exports = (selector) => {
	checkIfElementExists(selector);

	if (!isVisible(selector)) {
		browser.scroll(selector, 0, 0);
		waitForScrollToElement(selector);
	}
};
