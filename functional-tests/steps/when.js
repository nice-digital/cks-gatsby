import { When } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/when";

import clickElement from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import checkIfElementExists from "@nice-digital/wdio-cucumber-steps/lib/support/lib/checkIfElementExists";

import typeInSearchBox from "../support/action/typeInSearchBox";
import { getSelector } from "../support/selectors";

When(/^I type "([^"]*)" in the header search box$/, typeInSearchBox);

When(/^I click "([^"]*)" in the autocomplete options$/, (text) => {
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
});

When(/^I click on the "([^"]*)" breadcrumb$/, (breadcrumbText) => {
	const breadcrumbsListSelector = getSelector("breadcrumbs list");

	// Scroll to the element and wait for the scroll to complete as we're using smooth scrolling
	browser.scroll(breadcrumbsListSelector);
	browser.waitUntil(() =>
		browser.isVisibleWithinViewport(breadcrumbsListSelector)
	);

	$(breadcrumbsListSelector).$(`=${breadcrumbText}`).click();
});

// Use this for link clicks as it waits for the link to scroll into view before clicking it
// This is beacuse we're using CSS smooth scrolling, so we need to wait for the scroll to finish
// And the ekement to be in view before we click it
When(/^I click the "([^"]*)" link$/, (linkText) => {
	const selector = `=${linkText}`;

	checkIfElementExists(selector);

	// Scroll to the element and wait for the scroll to complete as we're using smooth scrolling
	browser.scroll(selector);
	browser.waitUntil(() => browser.isVisibleWithinViewport(selector));

	browser.click(selector);
});
