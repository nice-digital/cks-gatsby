import checkIfElementExists from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

const elementIsAtTopOfScreen = (selector) => {
	let element;
	if (selector.indexOf("=") > -1) {
		// WDIO selectors can be in the form TAG=TEXT so parse these out into xpath
		// selectors so we can execute this in the browser
		const parts = selector.split("="),
			tag = parts[0] || "*",
			text = parts[1],
			xPath = `.//${tag}[normalize-space() = \"${text}\"]`;
		element = document.evaluate(
			xPath,
			document,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
	} else {
		element = document.querySelector(selector);
	}
	return !!element && Math.round(element.getBoundingClientRect().y) === 0;
};

const windowIsScrolledToBottom = () =>
	window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

module.exports = (selector) => {
	checkIfElementExists(selector);

	if (!browser.isVisibleWithinViewport(selector)) {
		browser.scroll(selector, 0, 0);
		// Wait for the scroll to complete as we're using smooth scrolling
		browser.waitUntil(
			() =>
				browser.isVisibleWithinViewport(selector) &&
				(browser.execute(elementIsAtTopOfScreen, selector).value ||
					browser.execute(windowIsScrolledToBottom).value)
		);
	}
};
