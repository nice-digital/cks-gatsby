/* eslint-disable @typescript-eslint/camelcase */
const { createProxyMiddleware } = require("http-proxy-middleware");
const moment = require("moment");

require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
	siteMetadata: {
		siteUrl: "https://cks.nice.org.uk",
		title: "CKS",
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
		"gatsby-plugin-typescript",
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
		{
			resolve: `gatsby-source-cks`,
			options: {
				apiKey: process.env.API_KEY || "abc123",
				apiBaseUrl: process.env.API_BASE_URL || "http://localhost:7000/api",
				changesSinceDate: process.env.CHANGES_SINCE
					? moment(process.env.CHANGES_SINCE).toDate()
					: null,
			},
		},
		{
			resolve: "gatsby-plugin-eslint",
			options: {
				test: /\.(?:j|t)sx?$/,
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
				start_url: `/?utm_source=a2hs`,
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
						url: "/topics/?utm_source=shortcuts",
					},
					{
						name: "Specialities",
						url: "/specialities/?utm_source=shortcuts",
					},
					{
						name: "What's new",
						url: "/whats-new/?utm_source=shortcuts",
					},
					{
						name: "About CKS",
						url: "/about/?utm_source=shortcuts",
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
	developMiddleware: app => {
		app.use(createProxyMiddleware("http://localhost:5000/api/search"));
	},
};
