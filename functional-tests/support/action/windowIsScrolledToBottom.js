module.exports = (selector) => {
	return browser.execute(
		() => window.innerHeight + window.pageYOffset >= document.body.offsetHeight
	).value;
};
