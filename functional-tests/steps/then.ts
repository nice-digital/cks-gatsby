import { Then } from "cucumber";

import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText";
import { checkEqualsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkEqualsText";
import { getSelector, SelectorName } from "../support/selectors";

Then("I expect that the CKS GTM container is available", async () => {
	const containerId = (await browser.executeAsync((function (
		done: (containerId: string) => void
	) {
		((window as unknown) as { dataLayer: unknown[] }).dataLayer.push({
			event: "integration-test",
			eventCallback: function (containerId: string) {
				done(containerId);
			},
		});
	} as unknown) as () => void)) as string;

	expect(containerId).toEqual("GTM-54QC4NL");
});

Then(
	/^I expect to see "([^"]*)" in the autocomplete suggestions$/,
	async (text) => {
		const optionElement = await $(await getSelector("autocomplete option"));
		await optionElement.waitForExist();

		const menuSelector = await getSelector("autocomplete menu");
		await checkContainsText("element", menuSelector, "", text);
	}
);

Then(
	/^I expect to see a meta tag named "([^"]*)" with the content "([^"]*)"$/,
	async (name, content) => {
		const element = await $(`meta[name='${name}']`);
		expect(element).toHaveAttribute("content", content);
	}
);

Then(
	/^I expect to see a list of ([^0-9"]*)$/,
	async (selectorName: SelectorName) => {
		const selector = await getSelector(selectorName),
			elements = await $$(selector);
		expect(elements).toBeElementsArrayOfSize({ gte: 1 });
	}
);

Then(
	"I expect to see a list of {int} {}",
	async (numberOfResults: number, selectorName: SelectorName) => {
		const selector = await getSelector(selectorName),
			elements = await $$(selector);
		expect(elements).toBeElementsArrayOfSize(numberOfResults);
	}
);

Then("I expect to see search results for {}", async (searchTerm: string) => {
	const selector = await getSelector("search results summary");
	await checkContainsText("element", selector, "", `results for ${searchTerm}`);
});

Then(
	"I expect to see {int} total search results for {}",
	async (numberOfResults: number, searchTerm: string) => {
		const selector = await getSelector("search results summary");
		await checkEqualsText(
			"element",
			selector,
			"",
			`${numberOfResults} results for ${searchTerm}`
		);
	}
);
