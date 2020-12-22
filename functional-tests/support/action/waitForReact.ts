/**
 * Waits for the client side React code to be downloaded, parsed and executed by
 * checking for an attribute rendered by react-helmet.
 *
 * Use this method to wait for the page to be interactive.
 */
export async function waitForReact(timeout = 5000): Promise<void> {
	await browser.waitUntil(
		() =>
			browser.execute(
				() => !!document.documentElement.getAttribute("data-react-helmet")
			),
		{
			timeout,
			timeoutMsg: "JavaScript React bundle not loaded",
		}
	);
}
