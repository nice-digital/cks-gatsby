import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { openWebsite } from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite.js";

export async function cookiesToggle(type: "on" | "off"): Promise<void> {
	const preferenceCookie = await $(
		"#ccc-optional-categories > div:nth-child(1) > div > label"
	);
	preferenceCookie.isDisplayed;
	preferenceCookie.scrollIntoView();

	if (type == "off") {
		await pause("2000");
		await preferenceCookie.click();
		await pause("2000");
	}
	//to switch off cookies selection
	else await preferenceCookie.click();
	await pause("2000");
}
export async function WebsiteUsagecookiesToggle(
	type: "on" | "off"
): Promise<void> {
	const websiteUsageCookie = await $(
		"#ccc-optional-categories > div:nth-child(2) > div > label"
	);
	await websiteUsageCookie.isDisplayed();
	await websiteUsageCookie.scrollIntoView();

	if (type == "off") {
		await websiteUsageCookie.click();
		await pause("2000");
	}
	//to switch off cookies selection
	else await websiteUsageCookie.click();
	await pause("2000");
}
export async function marketingCookiesToggle(
	type: "on" | "off"
): Promise<void> {
	const marketingCookie = await $(
		"#ccc-optional-categories > div:nth-child(3) > div > label"
	);
	await marketingCookie.isDisplayed();
	await marketingCookie.scrollIntoView();

	if (type == "off") {
		await marketingCookie.click();
		await pause("2000");
	}
	//to switch off cookies selection
	else await marketingCookie.click();
	await pause("2000");
}

export default cookiesToggle;
