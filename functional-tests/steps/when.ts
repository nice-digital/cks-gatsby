import { When } from "cucumber";

import { openWebsite } from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite";
import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement";
import { waitFor } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import { checkIfElementExists } from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

import { typeInSearchBox } from "../support/action/typeInSearchBox";
import { scrollInToView } from "../support/action/scrollInToView";
import { waitForTitleToChange } from "../support/action/waitForTitleToChange";
import { waitForUrlToChange } from "../support/action/waitForUrlToChange";
import { waitForScrollToElement } from "../support/action/waitForScrollToElement";
import { acceptCookieBanner } from "../support/action/acceptCookieBanner";
import { waitForReact } from "../support/action/waitForReact";
import { waitForSearchLoad } from "../support/action/waitForSearchLoad";
import { getSelector } from "../support/selectors";
import { getPath } from "../support/pagePaths";

When(/^I type "([^"]*)" in the header search box$/, typeInSearchBox);

When(
	/^I click "([^"]*)" in the autocomplete options$/,
	async (text: string) => {
		const pageTitle = await browser.getTitle();

		const optionElement = await $(await getSelector("autocomplete option"));
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
When(/^I click the "([^"]*)" link$/, async (linkText: string) => {
	const pageTitle = await browser.getTitle(),
		urlStr = await browser.getUrl(),
		selector = `a=${linkText}`;

	await scrollInToView(selector);

	const element = await $(selector);
	await element.click();

	await waitForUrlToChange(urlStr);

	const oldUrl = new URL(urlStr);
	const newUrl = new URL(await browser.getUrl());

	if (newUrl.pathname !== oldUrl.pathname) {
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
