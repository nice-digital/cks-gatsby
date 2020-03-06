const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
	siteMetadata: {
		title: "CKS",
	},
	plugins: [
		"gatsby-plugin-typescript",
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
		app.use(
			"/api/search",
			createProxyMiddleware({
				target: "http://localhost:5000/",
				changeOrigin: true,
			})
		);
	},
};
