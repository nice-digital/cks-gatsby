import { checkIfElementExists } from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

const elementYPosition = (selector: string): number => {
	let element: Element;
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
		).singleNodeValue as Element;
	} else {
		element = document.querySelector(selector) as Element;
	}

	return element.getBoundingClientRect().y;
};

export async function isAtTopOfScreen(selector: string): Promise<boolean> {
	await checkIfElementExists(selector);

	const yPos = await browser.execute(elementYPosition, selector);

	// Scrolling to an element is never exactly 0 pixels, so leave a bit of tolerance +/- 1px
	return yPos >= -1 && yPos <= 1;
}
