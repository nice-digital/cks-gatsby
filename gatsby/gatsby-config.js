const { createProxyMiddleware } = require("http-proxy-middleware");
const moment = require("moment");

require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
});

/** The date from which to get updates */
const changesSinceDate = process.env.CHANGES_SINCE
	? moment.utc(process.env.CHANGES_SINCE).toDate()
	: moment().utc().subtract(1, "months").startOf("month").toDate();

module.exports = {
	siteMetadata: {
		siteUrl: "https://cks.nice.org.uk",
		title: "CKS",
		changesSinceDate,
	},
	plugins: [
		{
			resolve: `gatsby-plugin-sitemap`,
			options: {
				exclude: [`/search/`],
				serialize: ({ site, allSitePage }) =>
					allSitePage.edges.map(({ node }) => ({
						url: `${site.siteMetadata.siteUrl}${node.path}`,
					})),
			},
		},
		"gatsby-plugin-react-helmet",
		"gatsby-plugin-typescript",
		"gatsby-plugin-catch-links",
		"gatsby-plugin-sass",
		{
			resolve: "gatsby-plugin-prefetch-google-fonts",
			options: {
				fonts: [
					{
						family: "Lato",
						variants: ["400", "700", "900"],
					},
				],
			},
		},
		// Gatsby loads a single CSS bundle by default (see https://github.com/gatsbyjs/gatsby/issues/11072#issue-399193885).
		// But we want per-page chunks to minimize size, so use this plugin to split into separate chunks:
		"gatsby-plugin-split-css",
		{
			resolve: `gatsby-source-cks`,
			options: {
				apiKey: process.env.API_KEY || "abc123",
				apiBaseUrl: process.env.API_BASE_URL || "http://localhost:7000/api",
				changesSinceDate,
			},
		},
		{
			resolve: "gatsby-plugin-eslint",
			options: {
				test: /\.(?:j|t)sx?$/,
				exclude: /global-nav/,
			},
		},
		{
			resolve: "gatsby-plugin-google-tagmanager",
			options: {
				id: "GTM-54QC4NL",
				includeInDevelopment: true,
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `CKS (Clinical Knowledge Summaries)`,
				short_name: `CKS | NICE`,
				description: `Providing primary care practitioners with a readily accessible summary of the current evidence base and practical guidance on best practice`,
				start_url: `/?utm_source=a2hs&utm_medium=a2hs`,
				background_color: `#fff`,
				theme_color: `#004650`,
				display: `minimal-ui`,
				icon: `src/images/logo-square.svg`,
				icon_options: {
					purpose: `maskable any`,
				},
				include_favicon: false,
				shortcuts: [
					{
						name: "Topics A to Z",
						url: "/topics/?utm_source=a2hs&utm_medium=shortcuts",
					},
					{
						name: "Specialities",
						url: "/specialities/?utm_source=a2hs&utm_medium=shortcuts",
					},
					{
						name: "What's new",
						url: "/whats-new/?utm_source=a2hs&utm_medium=shortcuts",
					},
					{
						name: "About CKS",
						url: "/about/?utm_source=a2hs&utm_medium=shortcuts",
					},
				],
			},
		},
		{
			resolve: `gatsby-plugin-offline`,
			options: {
				precachePages: [
					`/specialities/`,
					`/specialities/*`,
					`/about/`,
					`/about/development/`,
					`/topics/`,
					`/topics/*`,
					`/search/`,
				],
				workboxConfig: {
					// Use the default gatsby runtimeCaching with 2 key differences:
					// use NetworkFirst for page-data.json and for HTML pages
					runtimeCaching: [
						{
							urlPattern: /(\.js$|\.css$|static\/)/,
							handler: `CacheFirst`,
						},
						{
							urlPattern: /^https?:.*\/page-data\/.*\/(page-data|app-data)\.json$/,
							handler: `NetworkFirst`,
							options: {
								networkTimeoutSeconds: 1,
							},
						},
						{
							urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
							handler: `StaleWhileRevalidate`,
						},
						{
							urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
							handler: `StaleWhileRevalidate`,
						},
						{
							// Try load HTML from the server first
							urlPattern: /\/$/,
							handler: `NetworkFirst`,
							options: {
								networkTimeoutSeconds: 1,
							},
						},
					],
				},
			},
		},
	],
	// Proxy the relative search endpoint to the .NET app for local dev
	developMiddleware: (app) => {
		// Proxy the relative search endpoint to the .NET app for local dev
		app.use(createProxyMiddleware("http://localhost:5000"));

		// ******* or *******

		// Use these settings to proxy to live search via this node app - https://github.com/wa-rren-dev/proxyToSearch
		// 		app.use(
		// 			"/api/search",
		// 			createProxyMiddleware({
		// 				target: "http://localhost:6001",
		// 				pathRewrite: {
		// 					"/api/search": "/search",
		// 				},
		// 			})
		// 		);
	},
};
