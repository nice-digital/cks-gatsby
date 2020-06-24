import "@nice-digital/design-system/scss/base.scss";

// Gatsby hook for when the route has changed on the client side
// See https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate
export const onRouteUpdate = ({ prevLocation, location }) => {
	if (prevLocation) {
		// Push our own event to the dataLayer on page change rather than using the
		// 'gatsby-route-change' event built into gatsby-plugin-google-tagmanager.
		// Because gatsby-route-change is pushed on initial page load as well as route change,
		// AND because it doesn't use requestAnimationFrame to delay until the page title has been updated

		const sendPageView = () => {
			window.dataLayer.push({ location: location.href });
			window.dataLayer.push({ event: "pageview" });
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
		window.dataLayer.push({ location: location.href });
	}
};
