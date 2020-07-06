module.exports = (text) => {
	const aside = $("aside");
	if (aside.isExisting("button=Close")) {
		aside.$("button=Close").click();
	}
};
