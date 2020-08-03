import { Then } from "cucumber";

import "@nice-digital/wdio-cucumber-steps/lib/then";
import setInputField from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import checkContainsText from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText";
import { getSelector } from "../support/selectors";

Then("I expect that the CKS GTM container is available", () => {
	const containerId = browser.executeAsync((done) => {
		window.dataLayer.push({
			event: "integration-test",
			eventCallback: function (containerId) {
				done(containerId);
			},
		});
	}).value;

	expect(containerId).to.equal("GTM-54QC4NL");
});

Then(/^I expect to see "([^"]*)" in the autocomplete suggestions$/, (text) => {
	waitFor(getSelector("autocomplete option"));
	checkContainsText("element", getSelector("autocomplete menu"), null, text);
});

Then(
	/^I expect to see a meta tag named "([^"]*)" with the content "([^"]*)"$/,
	(name, content) => {
		const selector = `meta[name='${name}']`;
		expect(browser.element(selector).getAttribute("content")).to.equal(content);
	}
);

Then(/^I expect to see a list of ([^"]*)$/, (selectorName) => {
	expect(
		browser.elements(getSelector(selectorName)).value
	).to.have.lengthOf.above(0);
});

Then(/^I expect to see at least 1 search result/, () => {
	//Wait for the results to load
	browser.waitForExist("#search-results-summary", 12000);
	expect(
		browser.element("#search-results-summary").getAttribute("data-result-count")
	).to.have.lengthOf.above(0);
});
