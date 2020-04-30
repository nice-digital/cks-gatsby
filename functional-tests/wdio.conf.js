const path = require("path");

const isInDocker = !!process.env.IN_DOCKER,
	isTeamCity = !!process.env.TEAMCITY_VERSION;

exports.config = {
	sync: true,
	maxInstances: 1,
	services: isInDocker ? [] : ["selenium-standalone"],
	seleniumLogs: "./logs",

	specs: ["./features/**/*.feature"],

	capabilities: [
		{
			browserName: "chrome",
			chromeOptions: {
				args: ["--window-size=1366,768"],
			},
		},
		{
			browserName: "firefox",
		},
	],

	logLevel: "error",
	coloredLogs: true,
	screenshotPath: "./screenshots/",
	baseUrl: "http://localhost:5000/",
	reporters: isTeamCity ? ["spec", "teamcity"] : ["spec"],

	// Use BDD with Cucumber
	framework: "cucumber",
	cucumberOpts: {
		compiler: ["js:babel-register"], // Babel so we can use ES6 in tests
		require: ["./steps/given.js", "./steps/when.js", "./steps/then.js"],
		tagExpression: "not @pending", // See https://docs.cucumber.io/tag-expressions/
		timeout: 30000,
	},

	// Set up global asssertion libraries
	before: function before() {
		const chai = require("chai");
		global.expect = chai.expect;
		global.assert = chai.assert;
		global.should = chai.should();
	},
};
