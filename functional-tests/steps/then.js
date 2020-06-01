import { Then } from "cucumber";

import "@nice-digital/wdio-cucumber-steps/lib/then";
import setInputField from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import checkContainsText from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText";

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
