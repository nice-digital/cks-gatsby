import setInputField from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";

const searchInputSelector = "header form[role='search'] [name='q']";

/**
 * Type the given characters into the header search input box
 */
module.exports = (text) => {
	waitFor(searchInputSelector);
	setInputField("set", text, searchInputSelector);
};
