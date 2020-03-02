module.exports = {
	siteMetadata: {
		title: "CKS",
	},
	plugins: [
		"gatsby-plugin-typescript",
		{
			resolve: "gatsby-plugin-eslint",
			options: {
				test: /\.js$|\.jsx$|\.ts$|\.tsx$/,
			},
		},
	],
};
