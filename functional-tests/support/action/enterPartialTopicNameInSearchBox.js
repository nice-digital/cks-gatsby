import setInputField from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";

const searchInputSelector = "header form[role='search'] [name='q']";

/**
 * Perform an click action on the given element
 */
module.exports = () => {
	waitFor(searchInputSelector);
	// Type first 3 characters of a topic e.g. Infertility
	setInputField("set", "inf", searchInputSelector);
};
