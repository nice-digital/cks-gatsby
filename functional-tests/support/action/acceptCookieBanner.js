module.exports = (text) => {
	const cookieControl = $("body #ccc");
	if (cookieControl.isVisible("button=Accept all cookies")) {
		cookieControl.$("button=Accept all cookies").click();
	}
};
