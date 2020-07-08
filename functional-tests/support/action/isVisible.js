/**
 * Returns whether the given element is visible within the viewport.
 * If the selector returns multiple elements, then it uses the first matching element.
 * @param {String} selector
 */
module.exports = (selector) => {
	const isVisible = browser.isVisibleWithinViewport(selector);
	return Array.isArray(isVisible) ? isVisible[0] : isVisible;
};
