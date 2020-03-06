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
};
