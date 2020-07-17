module.exports = (oldTitle, timeoutMs = 3000) => {
	browser.waitUntil(
		() => browser.getTitle() !== oldTitle,
		timeoutMs,
		`Page title was still '${oldTitle}' after ${timeoutMs}ms`
	);
};
