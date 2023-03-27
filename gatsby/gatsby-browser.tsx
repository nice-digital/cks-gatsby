import {
	ShouldUpdateScrollArgs,
	type RouteUpdateArgs,
	type WrapPageElementBrowserArgs,
} from "gatsby";
import React, { type ReactElement } from "react";
import {
	getCLS,
	getFID,
	getLCP,
	getTTFB,
	getFCP,
	Metric,
	ReportHandler,
} from "web-vitals";

import { Layout } from "./src/components/Layout/Layout";

// Gatsby hook for when the route has changed on the client side
// See https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate
export const onRouteUpdate = ({
	prevLocation,
	location,
}: RouteUpdateArgs): void => {
	if (prevLocation) {
		// Cast is needed because of https://github.com/gatsbyjs/gatsby/issues/29124
		const prevPath = (prevLocation as Location).pathname,
			path = location.pathname;

		// Push our own event to the dataLayer on page change rather than using the
		// 'gatsby-route-change' event built into gatsby-plugin-google-tagmanager.
		// Because gatsby-route-change is pushed on initial page load as well as route change,
		// AND because it doesn't use requestAnimationFrame to delay until the page title has been updated

		const sendPageView = () => {
			window.dataLayer.push({
				location: location.href,
				referrer: prevLocation.href,
			});
			// Don't consider hash changes to be a page view - pageviews only happy when the path changes
			if (prevPath != path) window.dataLayer.push({ event: "pageview" });
		};

		// Delay before push to the data layer, to make sure the page title has been updated
		// See https://github.com/gatsbyjs/gatsby/pull/10917/files#diff-bf0d94c8bf47d5c1687e342c2dba1e00R12-R13
		if ("requestAnimationFrame" in window) {
			requestAnimationFrame(() => {
				requestAnimationFrame(sendPageView);
			});
		} else {
			// simulate 2 rAF calls
			setTimeout(sendPageView, 32);
		}
	} else {
		window.dataLayer.push({
			location: location.href,
			referrer: document.referrer,
		});
	}
};
/**
 * Gatsby hook for overriding scroll position
 * See https://www.gatsbyjs.org/docs/browser-apis/#shouldUpdateScroll
 */
export const shouldUpdateScroll = ({
	routerProps: { location },
	prevRouterProps,
	getSavedScrollPosition,
}: ShouldUpdateScrollArgs): boolean | string | [number, number] => {
	if (
		// If there's no previous route props we're coming from an external site, which means
		// we want to scroll to the hash (if there is one), and _not_ a saved scroll position
		!prevRouterProps ||
		// Or we're linking to as hash within the same page
		(prevRouterProps.location.pathname === location.pathname && location.hash)
	) {
		const targetElement = location.hash
			? document.querySelector(location.hash)
			: null;

		// Provide our own scroll to hash to avoid Gatsby using a stored scroll position
		if (targetElement) {
			targetElement.setAttribute("tabIndex", "-1");
			(targetElement as HTMLElement).focus();
			window.setTimeout(() => targetElement.scrollIntoView(), 0);
			return false;
		}
		// Fallback to Gatsby's default behaviour if we can't find the element
		// This happens sometimes when the service worker kicks in too late
		else return true;
	}

	const savedScrollY = (getSavedScrollPosition(location)?.[1] || 0) as number;
	if (savedScrollY > 0) {
		window.scrollTo(0, savedScrollY);
		return false;
	}

	if (location.hash) {
		const targetElement = document.querySelector(location.hash);

		// Default to Gatsby's default behaviour if the element doesn't exist
		if (!targetElement) return true;

		// Provide our own scroll to hash to avoid Gatsby using a stored scroll position
		targetElement.setAttribute("tabIndex", "-1");
		(targetElement as HTMLElement).focus();
		window.setTimeout(() => targetElement.scrollIntoView(), 0);
		return false;
	}

	// Default to scrolling to the content start element as the standard navigation behaviour
	const contentStartElement = document.getElementById("content-start");

	if (!contentStartElement) return true;

	contentStartElement.setAttribute("tabIndex", "-1");
	contentStartElement.focus();
	window.setTimeout(() => contentStartElement.scrollIntoView(), 0);

	return false;
};

/**
 * Gatsby hook for when the runtime first starts client side
 * See https://www.gatsbyjs.com/docs/browser-apis#onClientEntry
 */
export const onClientEntry = (): void => {
	getCLS(sendWebVitalToGTM);
	getFCP(sendWebVitalToGTM);
	getFID(sendWebVitalToGTM);
	getLCP(sendWebVitalToGTM);
	getTTFB(sendWebVitalToGTM);
};

const sendWebVitalToGTM: ReportHandler = ({
	name,
	delta,
	id,
}: Metric): void => {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: "web-vitals",
		eventCategory: "Web Vitals",
		eventAction: name,
		eventLabel: id,
		eventValue: Math.round(name === "CLS" ? delta * 1000 : delta),
	});
};

export const wrapPageElement = ({
	element,
	props,
}: WrapPageElementBrowserArgs): ReactElement => (
	<Layout {...props}>{element}</Layout>
);
