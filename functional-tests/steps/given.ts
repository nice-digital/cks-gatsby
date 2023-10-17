import { Given } from "@cucumber/cucumber";

import { openWebsite } from "@nice-digital/wdio-cucumber-steps/lib/support/action/openWebsite";

import { acceptCookieBanner } from "../support/action/acceptCookieBanner";
import { acceptEULA } from "../support/action/acceptEULA";
import { waitForReact } from "../support/action/waitForReact";

import { getPath, PageName } from "../support/pagePaths";

Given(/^I open the (.*) page$/, async (pageName: PageName) => {
	await openWebsite("url", getPath(pageName));

	await waitForReact();

	// Make sure the cookie banner is dismissed before we continue, as it's an overlay so blocks clicks
	await acceptCookieBanner();

	// Dismiss the EULA, which will also block clicks
	await acceptEULA();
});
