import checkIfElementExists from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

const elementYPosition = (selector) => {
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

	return !!element && element.getBoundingClientRect().y;
};

module.exports = (selector) => {
	checkIfElementExists(selector);

	const yPos = browser.execute(elementYPosition, selector).value;

	// Scrolling to an element is never exactly 0 pixels, so leave a bit of tolerance +/- 1px
	return yPos >= -1 && yPos <= 1;
};
