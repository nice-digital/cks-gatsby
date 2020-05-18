const { createProxyMiddleware } = require("http-proxy-middleware");
const moment = require("moment");

require("dotenv").config({
	path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
	siteMetadata: {
		title: "CKS",
	},
	plugins: [
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
	],
	// Proxy the relative search endpoint to the .NET app for local dev
	developMiddleware: app => {
		app.use(createProxyMiddleware("http://localhost:5000/api/search"));
	},
};
