"use strict";

require("source-map-support").install();
require("ts-node/register/transpile-only");

exports.sourceNodes = require("./src/gatsby-node.ts").sourceNodes;
exports.createSchemaCustomization = require("./src/gatsby-node.ts").createSchemaCustomization;
