// URL is global in Node 10 and above but needs an explicit import for Node 8
const URL = require("url").URL;

import { When } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/when";

import clickElement from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import checkIfElementExists from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

import typeInSearchBox from "../support/action/typeInSearchBox";
import scrollInToView from "../support/action/scrollInToView";
import waitForTitleToChange from "../support/action/waitForTitleToChange";
import waitForUrlToChange from "../support/action/waitForUrlToChange";
import waitForScrollToElement from "../support/action/waitForScrollToElement";
import { getSelector } from "../support/selectors";

When(/^I type "([^"]*)" in the header search box$/, typeInSearchBox);

When(/^I click "([^"]*)" in the autocomplete options$/, (text) => {
	const pageTitle = browser.getTitle();
	typeInSearchBox("Ast");
	waitFor(getSelector("autocomplete option"));

	// For some reason we can't click on an autocomplete suggestion via wdio's
	// browser.click(element). So we have to use this workaround:
	browser.execute(
		(text, optionAnchorSelector) => {
			document.querySelectorAll(optionAnchorSelector).forEach((element) => {
				if (
					element.textContent.toLowerCase().indexOf(text.toLowerCase()) > -1
				) {
					element.click();
					return;
				}
			});
		},
		text,
		getSelector("autocomplete anchor")
	);
	waitForTitleToChange(pageTitle);
});

When(/^I click the ([^"]*) breadcrumb$/, (breadcrumbText) => {
	const pageTitle = browser.getTitle(),
		breadcrumbsListSelector = getSelector("breadcrumbs list");

	checkIfElementExists(breadcrumbsListSelector);
	scrollInToView(breadcrumbsListSelector);
	$(breadcrumbsListSelector).$(`=${breadcrumbText}`).click();
	waitForTitleToChange(pageTitle);
});

// Use this for link clicks as it waits for the link to scroll into view before clicking it.
// This is beacuse we're using CSS smooth scrolling (scroll-behavior: smooth; in CSS), which
// means the usual WDIO click won't work.
// We need to wait for the following before clicking:
// 	- the scroll to finish
//	- the element to be in viewport
//	- the scrolling to have stopped so the element is not moving
When(/^I click the "([^"]*)" link$/, (linkText) => {
	const pageTitle = browser.getTitle(),
		urlStr = browser.getUrl(),
		selector = `a=${linkText}`;

	checkIfElementExists(selector);
	scrollInToView(selector);
	browser.click(selector);

	waitForUrlToChange(urlStr);

	const oldUrl = new URL(urlStr);
	const newUrl = new URL(browser.getUrl());

	if (newUrl.pathname !== oldUrl.pathname) {
		// Because we use Gatsby links using history API we don't have full page loads
		// so we have to wait for the title to change before we click. This guarantees the
		// new page is ready before we execute the next step.
		waitForTitleToChange(pageTitle);
	} else {
		// We must be linking to a hash on the same page, which must be the ID of another element
		const targetElementId = newUrl.hash;
		waitForScrollToElement(targetElementId);
	}
});
