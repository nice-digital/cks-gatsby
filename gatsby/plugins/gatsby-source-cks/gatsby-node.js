"use strict";

// Allow execution of TypeScript, without having to pre-compile
// See https://github.com/TypeStrong/ts-node#programmatic
require("source-map-support").install();
require("ts-node/register/transpile-only");

// Re-export all the typescript exports - these are what Gatsby is looking for
module.exports = { ...require("./src/gatsby-node.ts") };
