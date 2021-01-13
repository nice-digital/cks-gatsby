/**
 * Returns whether the given element is visible within the viewport.
 * If the selector returns multiple elements, then it uses the first matching element.
 * @param {String} selector
 */
export async function isDisplayedInViewport(
	selector: string
): Promise<boolean> {
	const elements = await $$(selector);

	expect(elements).toBeElementsArrayOfSize({ gte: 1 });

	const element = elements[0];

	return element.isDisplayedInViewport();
}
