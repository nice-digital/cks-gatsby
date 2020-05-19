import "@nice-digital/design-system/scss/base.scss";

// Gatsby hook for when the route has changed on the client side
// See https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate
export const onRouteUpdate = ({ prevLocation }) => {
	if (prevLocation) {
		// Push our own event to the dataLayer on page change rather than using the
		// 'gatsby-route-change' event built into gatsby-plugin-google-tagmanager.
		// Because gatsby-route-change is pushed on initial page load as well as route change.
		setTimeout(() => {
			// Slight delay ensures the title has properly been changed (via react-helmet)
			window.dataLayer.push({ event: "pageview" });
		}, 50);
	}
};
