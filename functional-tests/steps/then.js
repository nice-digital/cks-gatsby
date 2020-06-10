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

Then(/^I see "([^"]*)" in the autocomplete suggestions$/, (text) => {
	waitFor(".autocomplete__option");
	checkContainsText("element", ".autocomplete__menu", null, text);
});

Then(
	/^I should see a meta tag named "([^"]*)" with the content "([^"]*)"$/,
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
