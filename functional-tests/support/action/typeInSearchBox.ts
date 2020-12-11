import { getSelector } from "../selectors/";

/**
 * Type the given characters into the header search input box
 */
export async function typeInSearchBox(text: string) {
	const selector = await getSelector("header search input"),
		element = await $(selector);

	await element.waitForDisplayed();
	await element.setValue(text);
}
