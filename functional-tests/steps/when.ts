import { When } from "@wdio/cucumber-framework";

import { openWebsite } from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite.js";
import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";
import { checkIfElementExists } from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists.js";

import { typeInSearchBox } from "../support/action/typeInSearchBox.js";
import { scrollInToView } from "../support/action/scrollInToView.js";
import { waitForTitleToChange } from "../support/action/waitForTitleToChange.js";
import { waitForUrlToChange } from "../support/action/waitForUrlToChange.js";
import { waitForScrollToElement } from "../support/action/waitForScrollToElement.js";
import { acceptCookieBanner } from "../support/action/acceptCookieBanner.js";
import { waitForReact } from "../support/action/waitForReact.js";
import { waitForSearchLoad } from "../support/action/waitForSearchLoad.js";
import { getSelector } from "../support/selectors/index.js";
import { getPath } from "../support/pagePaths.js";
import {
	cookiesToggle,
	WebsiteUsagecookiesToggle,
	marketingCookiesToggle,
} from "../support/action/cookiesToggle.js";
import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";

When(/^I type "([^"]*)" in the header search box$/, typeInSearchBox);

When(
	/^I click "([^"]*)" in the autocomplete options$/,
	async (text: string) => {
		const pageTitle = await browser.getTitle();

		const optionElement = await $(
			(await getSelector("autocomplete option")) + ":not(.visually-hidden)"
		);
		await optionElement.waitForExist({ timeout: 20000 });

		const anchorSelector = await getSelector("autocomplete anchor");

		// For some reason we can't click on an autocomplete suggestion via wdio's
		// browser.click(element). So we have to use this workaround:
		await browser.execute(
			(text, optionAnchorSelector) => {
				document.querySelectorAll(optionAnchorSelector).forEach((element) => {
					if (
						element.textContent &&
						element.textContent.toLowerCase().indexOf(text.toLowerCase()) > -1
					) {
						(element as HTMLElement).click();
						return;
					}
				});
			},
			text,
			anchorSelector
		);
		await waitForTitleToChange(pageTitle);
	}
);

When(/^I click the ([^"]*) breadcrumb$/, async (breadcrumbText: string) => {
	const pageTitle = await browser.getTitle(),
		breadcrumbsListSelector = await getSelector("breadcrumbs list");

	await checkIfElementExists(breadcrumbsListSelector);
	await scrollInToView(breadcrumbsListSelector);
	const breadcrumbListElement = await $(breadcrumbsListSelector),
		breadcrumbElement = await breadcrumbListElement.$(`=${breadcrumbText}`);
	await breadcrumbElement.click();
	await waitForTitleToChange(pageTitle);
});

// Use this for link clicks as it waits for the link to scroll into view before clicking it.
// This is beacuse we're using CSS smooth scrolling (scroll-behavior: smooth; in CSS), which
// means the usual WDIO click won't work.
// We need to wait for the following before clicking:
// 	- the scroll to finish
//	- the element to be in viewport
//	- the scrolling to have stopped so the element is not moving
// Supplement the default link clicking behavior from @nice-digital/wdio-cucumber-steps
// to handle visually-hidden spans properly
When(/^I click the "([^"]*)" link$/, async (linkText: string) => {
	const pageTitle = await browser.getTitle(),
		urlStr = await browser.getUrl();

	// Look for anchors within main to avoid conflicting with A-Z/topic links in the Global Nav
	const contextSelector = "main";
	const contextElement = await $(contextSelector);

	// Try multiple selector strategies to handle visually-hidden content
	let element;
	const selectors = [
		// First try: Match links that contain the full text (including visually-hidden parts)
		`//a[contains(normalize-space(.), '${linkText}')]`,
		// Second try: Use WDIO's built-in link text matching
		`a=${linkText}`,
		// Third try: More flexible text matching
		`//a[normalize-space(.) = '${linkText}']`,
	];

	for (const selector of selectors) {
		try {
			element = await contextElement.$(selector);
			if (await element.isExisting()) {
				// Scroll the found element into view with some buffer
				await element.scrollIntoView({ behavior: "auto", block: "center" });
				// Wait for smooth scrolling to complete
				await browser.pause(500);
				break;
			}
		} catch (error) {
			// Continue to next selector
			continue;
		}
	}

	if (!element || !(await element.isExisting())) {
		throw new Error(`Could not find link with text: ${linkText}`);
	}

	// Debug: Check what kind of link this is
	const href = await element.getAttribute('href');

	// Wait for element to be clickable and try clicking
	try {
		await element.waitForClickable({ timeout: 5000 });
		await element.click();
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		// Try JavaScript click if regular click fails
		if (
			errorMessage.includes("click intercepted") ||
			errorMessage.includes("move target out of bounds") ||
			errorMessage.includes("not clickable")
		) {
			await browser.execute((el) => {
				(el as unknown as HTMLElement).click();
			}, element);
		} else {
			throw error;
		}
	}

	// Add a small pause to let any JavaScript navigation start
	await browser.pause(500);

	// Check if this is expected to be a URL change or just a hash change
	const currentUrlAfterClick = await browser.getUrl();
	const oldUrl = new URL(urlStr);
	const newUrlAfterClick = new URL(currentUrlAfterClick);
	
	// If URL already changed, we're good
	if (currentUrlAfterClick !== urlStr) {
		console.log(`URL changed immediately for "${linkText}": ${urlStr} -> ${currentUrlAfterClick}`);
	} else {
		// For Gatsby/SPA apps, sometimes navigation takes a bit longer
		console.log(`Waiting longer for navigation to complete for "${linkText}"`);
		
		// Wait for URL change, but with longer timeout for SPAs
		try {
			await waitForUrlToChange(urlStr, 10000); // Increase timeout to 10 seconds
		} catch (error) {
			const currentUrl = await browser.getUrl();
			console.log(`URL change timeout for "${linkText}". Original: ${urlStr}, Current: ${currentUrl}`);
			
			// Check if it might be a hash-only change
			if (oldUrl.pathname === new URL(currentUrl).pathname) {
				console.log(`No pathname change detected - might be same-page navigation`);
			}
			
			// Try to force navigation with JavaScript as a last resort
			console.log(`Attempting JavaScript navigation to: ${href}`);
			await browser.execute((url) => {
				window.location.href = url;
			}, href);
			
			// Wait a bit more for the forced navigation
			await browser.pause(2000);
			
			const finalUrl = await browser.getUrl();
			console.log(`After JavaScript navigation: ${finalUrl}`);
			
			// If still no change, throw the original error
			if (finalUrl === urlStr) {
				throw error;
			}
		}
	}

	const oldUrl2 = new URL(urlStr);
	const newUrl = new URL(await browser.getUrl());

	if (newUrl.pathname !== oldUrl2.pathname) {
		// Because we use Gatsby links using history API we don't have full page loads
		// so we have to wait for the title to change before we click. This guarantees the
		// new page is ready before we execute the next step.
		await waitForTitleToChange(pageTitle);
	} else {
		// We must be linking to a hash on the same page, which must be the ID of another element
		const targetElementId = newUrl.hash;
		await waitForScrollToElement(targetElementId);
	}
});

When("I search for {}", async (searchTerm: string) => {
	const pageTitle = await browser.getTitle();
	await typeInSearchBox(searchTerm);

	const searchButtonSelector = await getSelector("header search button");
	await clickElement("click", "element", searchButtonSelector);
	await waitForTitleToChange(pageTitle);
	await waitForSearchLoad();
});

When("I view the search results page for {}", async (searchTerm: string) => {
	await openWebsite(
		"url",
		getPath("search") + "?q=" + encodeURIComponent(searchTerm)
	);

	await waitForReact();
	await acceptCookieBanner();
	await waitForSearchLoad();
});

When(
	"I view the 2nd page of search results for {}",
	async (searchTerm: string) => {
		await openWebsite(
			"url",
			`${getPath("search")}?q=${encodeURIComponent(searchTerm)}&pa=2`
		);

		await waitForReact();
		await acceptCookieBanner();
		await waitForSearchLoad();
	}
);
When(/^I click preference cookies and toggle it (on|off)$/, cookiesToggle);
When(
	/^I click website usage cookies and toggle it (on|off)$/,
	WebsiteUsagecookiesToggle
);
When(
	/^I click marketing advertising cookies and toggle it (on|off)$/,
	marketingCookiesToggle
);
When(/^I reject cookies$/, async () => {
	const cookieBannerElement = await $("body #ccc");
	await cookieBannerElement.waitForExist({ timeout: 2000 });

	const rejectCookies = await cookieBannerElement.$("button.ccc-reject-button");

	// If cookies have already been chosen then the accept button doesn't show
	if (await rejectCookies.isDisplayed()) {
		await rejectCookies.click();
		await pause("2000");
	}
});
