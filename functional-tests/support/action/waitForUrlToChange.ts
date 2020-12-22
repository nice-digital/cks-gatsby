export async function waitForUrlToChange(
	oldUrl: string,
	timeout = 5000
): Promise<void> {
	await browser.waitUntil(async () => (await browser.getUrl()) !== oldUrl, {
		timeout,
		timeoutMsg: `URL was still '${oldUrl}' after ${timeout}ms`,
	});
}
