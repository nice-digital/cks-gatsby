import os from "os";

const isInDocker = !!process.env.IN_DOCKER,
	isTeamCity = !!process.env.TEAMCITY_VERSION,
	cpuCount = os.cpus().length,
	totalMemGB = os.totalmem() / 1024 ** 3;

// "goog:loggingPrefs" is a chromedriver vendor capability that @wdio/types
// doesn't declare, so add it to the capability type rather than dropping it
type ChromeCapabilities = WebdriverIO.Capabilities & {
	"goog:loggingPrefs"?: { browser?: string };
};

// Which webdriver commands are in flight, so a failed step can report what it
// was actually blocked on. The step's own waitUntil timeouts can't rescue it: they
// only fire between polls, never while awaiting a hung command underneath.
type CommandRecord = { name: string; startedAt: number; durationMs?: number };

const inFlightCommands: CommandRecord[] = [],
	completedCommands: CommandRecord[] = [];

// Must be called before we issue any commands of our own, which would
// otherwise push the real culprit out of the in-flight list
function snapshotCommands(): string {
	const now = Date.now(),
		stuck = inFlightCommands.map(
			(command) => `${command.name} (${now - command.startedAt}ms and counting)`
		),
		recent = completedCommands
			.slice(-8)
			.map((command) => `${command.name}=${command.durationMs}ms`);

	return `in flight: ${stuck.join(", ") || "none"} | last completed: ${
		recent.join(" ") || "none"
	}`;
}

// Diagnostics for step timeouts: dump what the browser was doing
// when a step failed. A client side Gatsby transition leaves the
// original page's navigation entry in place, so an entry whose URL matches the
// CURRENT location means the browser did a full page load where a history API
// transition was expected - i.e. Gatsby's hard reload fallback after a failed
// page-data/chunk fetch. A failed fetch also shows up as a SEVERE browser console entry.
async function logStallDiagnostics(
	errorStack: string,
	commands: string
): Promise<void> {
	const log = (message: string): void =>
		console.log(`[stall-diagnostics] ${message}`);

	const collect = async (): Promise<void> => {
		const state = await browser.execute(() => ({
			url: window.location.href,
			title: document.title,
			readyState: document.readyState,
			navigations: performance.getEntriesByType("navigation").map((entry) => ({
				type: (entry as PerformanceNavigationTiming).type,
				url: entry.name,
				duration: Math.round(entry.duration),
			})),
		}));

		log(`url=${state.url}`);
		log(`title=${state.title} readyState=${state.readyState}`);
		log(`navigations=${JSON.stringify(state.navigations)}`);

		// getLogs is a chromedriver/selenium endpoint so it's only available over
		// the webdriver protocol, i.e. the grid in Docker and not devtools locally.
		// The log buffer resets on read, so this holds everything logged since the
		// previous failed step.
		if (isInDocker && typeof browser.getLogs === "function") {
			const entries = (await browser.getLogs("browser")) as {
				level?: string;
				message?: string;
			}[];

			log(`browser console: ${entries.length} entries`);
			entries.forEach((entry) => log(`  ${entry.level}: ${entry.message}`));
		}
	};

	log(`step failed: ${errorStack.split("\n")[0]}`);
	log(commands);

	let timer: NodeJS.Timeout | undefined;

	try {
		await Promise.race([
			collect(),
			// Never let a wedged session hang the run. Hitting this is itself a
			// result: it means the browser is still blocked after the step timeout.
			new Promise<never>((_resolve, reject) => {
				timer = setTimeout(
					() => reject(new Error("gave up after 15s, session still blocked")),
					15000
				);
			}),
		]);
	} catch (diagnosticError) {
		log(`could not collect: ${(diagnosticError as Error).message}`);
	} finally {
		clearTimeout(timer);
	}
}

export const config: WebdriverIO.Config = {
	// Use devtools to control Chrome when we're running tests locally
	// Avoids issues with having the wrong ChromeDriver installed via selenium-standalone when Chrome updates every 6 weeks.
	// We need to use webdriver protocol in Docker because we use the selenium grid.
	automationProtocol: isInDocker ? "webdriver" : "devtools",

	maxInstances: isInDocker ? 3 : 1,
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
			// Buffer browser console entries so logStallDiagnostics can dump them
			// when a step fails. Failed resource fetches log at SEVERE.
			"goog:loggingPrefs": { browser: "ALL" },
			"goog:chromeOptions": {
				args: [
					"--window-size=1366,768",
					// Automation optimizations as per https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
					"--disable-dev-shm-usage",
					"--enable-automation",
					"--disable-extensions",
					"--disable-component-extensions-with-background-pages",
					"--disable-background-networking",
					"--disable-sync",
				].concat(isInDocker ? "--headless" : []),
			},
		},
	] as ChromeCapabilities[],

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
	},

	onPrepare: function () {
		console.log(
			`[wdio.conf] Running in ${isInDocker ? "Docker" : "local"}${
				isTeamCity ? " (TeamCity)" : ""
			} → CPUs: ${cpuCount} | Memory: ${totalMemGB.toFixed(1)} GB`
		);
	},

	beforeCommand: function (commandName) {
		inFlightCommands.push({ name: commandName, startedAt: Date.now() });
	},

	afterCommand: function (commandName) {
		// lastIndexOf so nested commands (waitForExist calling isExisting, say)
		// unwind in the right order
		const index = inFlightCommands
			.map((command) => command.name)
			.lastIndexOf(commandName);

		if (index === -1) return;

		const [finished] = inFlightCommands.splice(index, 1);

		completedCommands.push({
			...finished,
			durationMs: Date.now() - finished.startedAt,
		});

		if (completedCommands.length > 12) completedCommands.shift();
	},

	afterStep: async function (_test, _scenario, { error }) {
		// Take screenshots on error, these end up in the Allure reports
		if (error) {
			// Snapshot first: everything below issues commands of its own
			const commands = snapshotCommands();

			await browser.takeScreenshot();
			await logStallDiagnostics(error, commands);
		}
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
