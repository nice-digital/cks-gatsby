import setInputField from "@nice-digital/wdio-cucumber-steps/lib/support/action/setInputField";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";
import { getSelector } from "../selectors/";

/**
 * Type the given characters into the header search input box
 */
module.exports = (text) => {
	waitFor(getSelector("header search input"));
	setInputField("set", text, getSelector("header search input"));
};
