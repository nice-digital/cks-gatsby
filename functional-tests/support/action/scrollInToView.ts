import { checkIfElementExists } from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

import { waitForScrollToElement } from "./waitForScrollToElement";

export async function scrollInToView(
	selector: string,
	contextSelector?: string
) {
	await checkIfElementExists(selector);

	const element = contextSelector
		? await (await $(contextSelector)).$(selector)
		: await $(selector);
	await element.scrollIntoView();
	await waitForScrollToElement(selector, 5000, contextSelector);
}
