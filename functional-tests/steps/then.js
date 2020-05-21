import { Then } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/then";

import setInputField from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import checkContainsText from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText";

Then(/^I see "([^"]*)" in the autocomplete suggestions$/, (text) => {
	waitFor(".autocomplete__option");
	checkContainsText("element", ".autocomplete__menu", null, text);
});
