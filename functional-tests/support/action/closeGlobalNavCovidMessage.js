module.exports = (text) => {
	const aside = $("aside");
	if (aside.isExisting("button=Close")) {
		// Avoid "Element is not clickable at point" errors by calling click in the browser directly
		browser.execute(() => {
			document.querySelector("aside button").click();
		});
	}
};
