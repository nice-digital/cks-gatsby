"use strict";

// //See https://github.com/gatsbyjs/gatsby/issues/6638

// exports.onCreateWebpackConfig = ({ actions }) => {
// 	actions.setWebpackConfig({
// 		devtool: "eval-source-map",
// 	});
// };

require("source-map-support").install();
require("ts-node/register/transpile-only");

exports.createPages = require("./src/gatsby-node.ts").createPages;
