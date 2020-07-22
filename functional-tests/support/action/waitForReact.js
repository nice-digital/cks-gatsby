/**
 * Waits for the client side React code to be downloaded, parsed and executed by
 * checking for an attribute rendered by react-helmet.
 *
 * Use this method to wait for the page to be interactive.
 */
module.exports = (timeoutMs = 5000) => {
	browser.waitUntil(
		() =>
			browser.execute(
				() => !!document.documentElement.getAttribute("data-react-helmet")
			).value,
		timeoutMs,
		"JavaScript React bundle not loaded"
	);
};
