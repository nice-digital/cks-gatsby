import os from "os";

const isInDocker = !!process.env.IN_DOCKER,
	isTeamCity = !!process.env.TEAMCITY_VERSION,
	cpuCount = os.cpus().length,
	totalMemGB = os.totalmem() / 1024 ** 3;

export const config: WebdriverIO.Config = {
	// Use devtools to control Chrome when we're running tests locally
	// Avoids issues with having the wrong ChromeDriver installed via selenium-standalone when Chrome updates every 6 weeks.
	// We need to use webdriver protocol in Docker because we use the selenium grid.
	automationProtocol: isInDocker ? "webdriver" : "devtools",

	maxInstances: isInDocker ? 2 : 1,
	path: "/wd/hub",
	port: isInDocker ? 4444 : 5000,

	specs: ["./features/**/*.feature"],

	exclude: ["./features/**/header.feature", "./features/**/searchPage.feature"],

	capabilities: [
		{
			browserName: "chrome",
			// Don't block navigation on full page load (fonts, GTM, cookie-banner
			// CDN etc). DOMContentLoaded is enough: element interactions auto-wait,
			// so a slow third-party resource can't stall `browser.url()` past the
			// cucumber step timeout.
			pageLoadStrategy: "eager",
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
		require: [
			"./steps/**/*.ts",
			"./node_modules/@nice-digital/wdio-cucumber-steps/lib/index.js",
		],
		tagExpression: "not @pending", // See https://docs.cucumber.io/tag-expressions/
		// Need quite a long timeout here because some of the Axe a11y tests take a while for longer pages (like A to Z)
		timeout: 60000,
		// Retry a failed scenario once on CI: one-off browser/page-load stalls
		// shouldn't fail the whole build. Genuine failures reproduce on the retry.
		retry: isInDocker ? 1 : 0,
	},

	onPrepare: function () {
		console.log(
			`[wdio.conf] Running in ${isInDocker ? "Docker" : "local"}${
				isTeamCity ? " (TeamCity)" : ""
			} → CPUs: ${cpuCount} | Memory: ${totalMemGB.toFixed(1)} GB`
		);
	},

	afterStep: async function (_test, _scenario, { error }) {
		// Take screenshots on error, these end up in the Allure reports
		if (error) await browser.takeScreenshot();
	},

	afterScenario: async function (_world, _result, _context) {
		// Clear session storage after each test because Gatsby stores scroll
		// positions of each page, which causes issues running multiple tests
		// on the same page in the same browser instance when scrolling to links
		// await browser.execute("sessionStorage.clear()");
		//TODO window.sessionStorage required for wdio8 upgrade
		await browser.execute("window.sessionStorage.clear()");
	},

	autoCompileOpts: {
		autoCompile: true,
		// see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
		// for all available options
		tsNodeOpts: {
			transpileOnly: true,
			project: "tsconfig.json",
		},
	},
};
