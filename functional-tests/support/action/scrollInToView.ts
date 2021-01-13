import { checkIfElementExists } from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

import { waitForScrollToElement } from "./waitForScrollToElement";

export async function scrollInToView(selector: string) {
	await checkIfElementExists(selector);

	const element = await $(selector);
	await element.scrollIntoView();
	await waitForScrollToElement(selector);
}
