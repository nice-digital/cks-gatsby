import { Given } from "cucumber";

import { openWebsite } from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite";

import { acceptCookieBanner } from "../support/action/acceptCookieBanner";
import { waitForReact } from "../support/action/waitForReact";

import { getPath, PageName } from "../support/pagePaths";

Given(/^I open the (.*) page$/, async (pageName: PageName) => {
	await openWebsite("url", getPath(pageName));

	await waitForReact();

	// Make sure the cookie banner is dismissed before we continue, as it's an overlay so blocks clicks
	await acceptCookieBanner();
});
