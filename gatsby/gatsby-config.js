const { createProxyMiddleware } = require("http-proxy-middleware");

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
		"gatsby-source-cks",
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
