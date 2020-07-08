module.exports = (oldUrl) => {
	browser.waitUntil(() => browser.getUrl() !== oldUrl);
};
