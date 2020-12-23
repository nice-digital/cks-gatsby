export async function windowIsScrolledToBottom(): Promise<boolean> {
	return browser.execute(
		() => window.innerHeight + window.pageYOffset >= document.body.offsetHeight
	);
}
