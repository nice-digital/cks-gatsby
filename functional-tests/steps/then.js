import { Then } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/then";

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
