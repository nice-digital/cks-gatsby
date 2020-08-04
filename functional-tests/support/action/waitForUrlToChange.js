module.exports = (oldUrl, timeoutMs = 5000) => {
	browser.waitUntil(
		() => browser.getUrl() !== oldUrl,
		timeoutMs,
		`URL was still '${oldUrl}' after ${timeoutMs}ms`
	);
};
