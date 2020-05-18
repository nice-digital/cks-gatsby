import { When } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/when";

import clickElement from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import debug from "@nice-digital/wdio-cucumber-steps/lib/support/action/debug";

import typeInSearchBox from "../support/action/typeInSearchBox";

When(/^I type "([^"]*)" in the header search box$/, typeInSearchBox);

When(/^I click "([^"]*)" in the autocomplete options$/, (text) => {
	typeInSearchBox("Ast");
	waitFor(".autocomplete__option");

	// For some reason we can't click on an autocomplete suggestion via wdio's
	// browser.click(element). So we have to use this workaround:
	browser.execute((text) => {
		document.querySelectorAll(".autocomplete__option a").forEach((element) => {
			if (element.textContent.toLowerCase().indexOf(text.toLowerCase()) > -1) {
				element.click();
				return;
			}
		});
	}, text);
});
