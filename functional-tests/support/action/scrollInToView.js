module.exports = (selector) => {
	if (!browser.isVisibleWithinViewport(selector)) {
		browser.scroll(selector, 0, 0);
		// Wait for the scroll to complete as we're using smooth scrolling
		browser.waitUntil(
			() =>
				browser.isVisibleWithinViewport(selector) &&
				(browser.getLocationInView(selector, "y") === 0 ||
					browser.execute(function () {
						return (
							window.innerHeight + window.pageYOffset >=
							document.body.offsetHeight
						);
					}).value)
		);
	}
};
