import { scrollIntoView } from "@nice-digital/wdio-cucumber-steps/lib/support/action/scrollIntoView.js";
import { checkIfElementExists } from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists.js";

import { waitForScrollToElement } from "./waitForScrollToElement.js";

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
