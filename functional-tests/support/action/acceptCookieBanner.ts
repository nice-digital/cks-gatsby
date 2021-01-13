export async function acceptCookieBanner(): Promise<void> {
	const cookieControlElement = await $("body #ccc"),
		acceptButton = await cookieControlElement.$("button=Accept all cookies");

	if (await acceptButton.isDisplayed()) await acceptButton.click();
}
