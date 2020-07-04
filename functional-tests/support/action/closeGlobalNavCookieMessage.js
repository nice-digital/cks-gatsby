module.exports = (text) => {
	const header = $("header");
	if (header.isExisting("button=Accept and close")) {
		header.$("button=Accept and close").click();
	}
};
