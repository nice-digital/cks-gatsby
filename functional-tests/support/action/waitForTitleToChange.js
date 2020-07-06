module.exports = (oldTitle) => {
	browser.waitUntil(() => browser.getTitle() !== oldTitle);
};
