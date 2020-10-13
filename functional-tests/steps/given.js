import { Given } from "cucumber";
import "@nice-digital/wdio-cucumber-steps/lib/given";

import openWebsite from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite";
import waitFor from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitFor";

import acceptCookieBanner from "../support/action/acceptCookieBanner";
import waitForReact from "../support/action/waitForReact";

import { getPath } from "../support/pagePaths";

Given(/^I open the (.*) page$/, (pageName) => {
	openWebsite("url", getPath(pageName));

	waitForReact();

	// Make sure the cookie banner is dismissed before we continue, as it's an overlay so blocks clicks
	acceptCookieBanner();
});
