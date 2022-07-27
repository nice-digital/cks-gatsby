import { Config } from "webdriverio";

const isInDocker = !!process.env.IN_DOCKER,
	isTeamCity = !!process.env.TEAMCITY_VERSION;

export const config: Config = {
	maxInstances: isInDocker ? 10 : 2,
	services: isInDocker
		? []
		: [
				[
					"selenium-standalone",
					{
						logPath: "./logs",
					},
				],
		  ],
	path: "/wd/hub",

	specs: ["./features/**/*.feature"],

	capabilities: [
		{
			browserName: "chrome",
			"goog:chromeOptions": {
				args: ["--window-size=1366,768"].concat(isInDocker ? "--headless" : []),
			},
		},
	],

	logLevel: "error",

	baseUrl: "http://localhost:5000/",
	reporters: isTeamCity
		? [
				"spec",
				"teamcity",
				[
					"allure",
					{
						useCucumberStepReporter: true,
						// Turn on screenshot reporting for error shots
						disableWebdriverScreenshotsReporting: false,
					},
				],
		  ]
		: ["spec"],

	// Use BDD with Cucumber
	framework: "cucumber",

	cucumberOpts: {
		requireModule: ["ts-node/register/transpile-only"],
		require: [
			"./steps/**/*.ts",
			"./node_modules/@nice-digital/wdio-cucumber-steps/lib",
		],
		tagExpression: "not @pending", // See https://docs.cucumber.io/tag-expressions/
		timeout: 60000,
	},

	afterScenario: async function (_uri, _feature, _scenario, { exception }) {
		// Take screenshots on error, these end up in the Allure reports
		if (exception) await browser.takeScreenshot();
	},
};
