const { createProxyMiddleware } = require("http-proxy-middleware");
const moment = require("moment");

require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
});

/** The date from which to get updates */
const changesSinceDate = process.env.CHANGES_SINCE
	? moment.utc(process.env.CHANGES_SINCE).toDate()
	: moment()
			.utc()
			.subtract(1, "months")
			.startOf("month")
			.toDate();

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
				changesSinceDate,
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
	],
	// Proxy the relative search endpoint to the .NET app for local dev
	developMiddleware: app => {
		app.use(createProxyMiddleware("http://localhost:5000/api/search"));
	},
};
