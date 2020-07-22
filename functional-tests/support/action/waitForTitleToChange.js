module.exports = (oldTitle, timeoutMs = 5000) => {
	browser.waitUntil(
		() => browser.getTitle() !== oldTitle,
		timeoutMs,
		`Page title was still '${oldTitle}' after ${timeoutMs}ms`
	);
};
