import { Given } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/given";

import openWebsite from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";

import closeGlobalNavCookieMessage from "../support/action/closeGlobalNavCookieMessage";
import closeGlobalNavCovidMessage from "../support/action/closeGlobalNavCovidMessage";

import { getPath } from "../support/pagePaths";

Given(/^I open the (.*) page$/, (pageName) => {
	openWebsite("url", getPath(pageName));

	// TODO: Remove this when https://nicedigital.atlassian.net/browse/CKS-307 is done
	waitFor("header");

	// We don't care about the global nav banners and they just add noise, so close them
	closeGlobalNavCovidMessage();
	closeGlobalNavCookieMessage();
});
