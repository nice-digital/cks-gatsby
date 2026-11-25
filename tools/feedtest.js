#!/usr/bin/env node
/**
 * feedtest.js - check the CKS API feed is alive and every topic returns valid JSON.
 *
 * First checks the feed is alive: the topics index and changes-since endpoints
 * the build calls first, with response times and a hint about what any failure
 * means (unreachable, key rejected, wrong URL, API erroring). Then requests
 * each topic's currentVersionLink the same way gatsby-source-cks does
 * (apiBaseUrl + path), and reports any topic that returns an error status, an
 * empty body or invalid JSON. Use --quick to stop after the health check.
 *
 * This is a manual diagnostic tool. It isn't part of the build or CI.
 *
 * Usage (from the repo root):
 *   node tools/feedtest.js [--env production|development] [--base-url URL] [--quick]
 *
 * Config is resolved in this order (first wins):
 *   1. --base-url flag (base URL only)
 *   2. API_BASE_URL / API_KEY environment variables
 *   3. gatsby/.env.<env> (default: production)
 *   4. interactive prompt (the key is read without echoing)
 *
 * No secrets are stored in this script, and the API key is never printed.
 * Requires Node 21.7+ (built-in fetch and util.parseEnv). No npm install needed.
 *
 * Exit codes: 0 = all OK, 1 = one or more topics failed,
 *             2 = feed not alive or setup error
 */

"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { parseArgs, parseEnv } = require("util");

const REQUEST_TIMEOUT_MS = 60_000;

const usage = `Check the CKS API feed is alive, and every topic returns valid JSON.

Usage (from the repo root):
  node tools/feedtest.js [--env production|development] [--base-url URL] [--quick]

Options:
  -e, --env       Which gatsby/.env.<env> file to read (default: production)
  -b, --base-url  API base URL, overrides env vars and the .env file
  -q, --quick     Only check the feed is alive (topics index and changes-since),
                  don't fetch every topic
  -h, --help      Show this help

Config order: --base-url, then API_BASE_URL / API_KEY env vars, then
gatsby/.env.<env>, then an interactive prompt (key input is hidden).
CHANGES_SINCE is read the same way, defaulting to the start of last month.

Exit codes: 0 = all OK, 1 = one or more topics failed,
            2 = feed not alive or setup error`;

/** Feed not alive, or a setup problem (bad options or config): exit code 2 */
class SetupError extends Error {}

const fail = (message) => {
	throw new SetupError(message);
};

const parseOptions = () => {
	try {
		return parseArgs({
			options: {
				env: { type: "string", short: "e", default: "production" },
				"base-url": { type: "string", short: "b" },
				quick: { type: "boolean", short: "q" },
				help: { type: "boolean", short: "h" },
			},
		}).values;
	} catch (e) {
		fail(`${e.message}\n\n${usage}`);
	}
};

/** Read a dotenv file into an object without executing anything in it */
const readEnvFile = (envFile) => {
	if (!fs.existsSync(envFile)) return {};
	return parseEnv(fs.readFileSync(envFile, "utf8"));
};

/** Prompt for a value on the terminal, optionally hiding what's typed */
const prompt = (question, { hidden = false } = {}) =>
	new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: Boolean(process.stdin.isTTY),
		});
		if (hidden) {
			// Show the question, but don't echo the characters typed after it
			const write = rl._writeToOutput.bind(rl);
			rl._writeToOutput = (text) => {
				if (text.includes(question)) write(text);
			};
		}
		rl.question(question, (answer) => {
			rl.close();
			if (hidden) process.stdout.write("\n");
			resolve(answer.trim());
		});
	});

/**
 * Fetch a URL and check the body is non-empty JSON.
 * Returns { status, problem, json, seconds } where problem is undefined if all
 * is OK, and seconds is how long the request took.
 */
const fetchJson = async (url, apiKey) => {
	const start = performance.now();
	const elapsed = () => (performance.now() - start) / 1000;

	let response;
	try {
		response = await fetch(url, {
			headers: {
				"ocp-apim-subscription-key": apiKey,
				Accept: "application/json",
			},
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
	} catch (e) {
		const reason =
			e.name === "TimeoutError"
				? `timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
				: // fetch only says "fetch failed"; the cause has the real reason,
					// e.g. ECONNREFUSED or ENOTFOUND (a code, as the message can be empty)
					e.cause?.code || e.cause?.message || e.message;
		return { problem: `no response (${reason})`, seconds: elapsed() };
	}

	const body = await response.text();
	const result = { status: response.status, seconds: elapsed() };
	if (!response.ok) return { ...result, problem: `HTTP ${response.status}` };
	if (body.trim().length === 0) return { ...result, problem: "empty body" };

	try {
		return { ...result, json: JSON.parse(body) };
	} catch (e) {
		return { ...result, problem: `invalid JSON: ${e.message}` };
	}
};

/** A plain-English hint about what a failed status probably means */
const explainStatus = (status) => {
	if (status === undefined)
		return "API unreachable: check the base URL, your network/VPN, or whether the API is down";
	if (status === 401 || status === 403)
		return "API key rejected: check API_KEY is correct and the subscription is active";
	if (status === 404)
		return "endpoint not found: check the base URL (e.g. does it need /v2/?)";
	if (status === 429) return "rate limited by the API: wait and try again";
	if (status >= 500) return "the API is erroring on its side";
	return undefined;
};

/** Same default as gatsby-config.js: start of the previous month, UTC */
const defaultChangesSinceDate = () => {
	const now = new Date();
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
};

const formatSeconds = (seconds) => `${seconds.toFixed(2)}s`;

/** e.g. plural(1, "topic") = "1 topic", plural(2, "topic") = "2 topics" */
const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

/** Print one line of the health report */
const reportLine = (label, result, detail) => {
	const status = result.status ? String(result.status) : "---";
	const outcome = result.problem ? "FAIL" : "OK  ";
	console.log(
		`  ${outcome}  ${label.padEnd(15)} ${status.padEnd(4)} ${formatSeconds(
			result.seconds
		).padStart(7)}  ${result.problem || detail}`
	);
	const hint = result.problem && explainStatus(result.status);
	if (hint) console.log(`        ${hint}`);
};

/**
 * Check the feed is alive: the two endpoints the build calls before it fetches
 * any topics. Returns the topics list, or throws a SetupError if the feed
 * isn't usable.
 */
const checkHealth = async (baseUrl, apiKey, changesSinceDate) => {
	console.log("Feed health");

	// URLs are built exactly like the plugin (apiBaseUrl + path, no
	// normalisation), so a trailing slash on the base URL gives "//" as it does
	// in the real build.
	const topicsUrl = `${baseUrl}/topics`;
	const changesUrl = `${baseUrl}/changes-since/${changesSinceDate.toISOString()}`;

	const [index, changes] = await Promise.all([
		fetchJson(topicsUrl, apiKey),
		fetchJson(changesUrl, apiKey),
	]);

	// The topics index must have a non-empty topics array
	const topics = index.json?.topics;
	if (!index.problem && !Array.isArray(topics))
		index.problem = "response has no topics array";
	else if (!index.problem && topics.length === 0)
		index.problem = "topics array is empty";
	reportLine("topics index", index, plural(topics?.length, "topic"));

	// The build calls changes.forEach, so this must be an array
	if (!changes.problem && !Array.isArray(changes.json))
		changes.problem = "response isn't an array";
	reportLine(
		"changes-since",
		changes,
		`${plural(changes.json?.length, "change")} since ${changesSinceDate
			.toISOString()
			.slice(0, 10)}`
	);

	// Warnings: things that won't break the build but are worth knowing
	const warnings = [];
	if (Array.isArray(topics)) {
		const { topicCount } = index.json;
		if (topicCount !== topics.length)
			warnings.push(
				`topicCount says ${topicCount} but ${topics.length} topics are listed`
			);
		const missingLink = topics.filter((t) => !t.id || !t.currentVersionLink);
		if (missingLink.length > 0)
			warnings.push(
				`${plural(missingLink.length, "topic")} with no id or currentVersionLink: ${missingLink
					.map((t) => t.name || "(no name)")
					.join(", ")}`
			);
		const ids = topics.map((t) => t.id);
		const duplicates = [
			...new Set(ids.filter((id, i) => ids.indexOf(id) !== i)),
		];
		if (duplicates.length > 0)
			warnings.push(`duplicate topic ids: ${duplicates.join(", ")}`);
	}
	warnings.forEach((w) => console.log(`  WARN  ${w}`));

	if (index.problem || changes.problem)
		fail("feed is not alive: the build would fail before fetching any topics");

	console.log("Feed is alive\n");
	return topics;
};

const main = async () => {
	const options = parseOptions();
	if (options.help) {
		console.log(usage);
		return 0;
	}

	const envFile = path.resolve(
		__dirname,
		"..",
		"gatsby",
		`.env.${options.env}`
	);
	const envFileValues = readEnvFile(envFile);

	let baseUrl =
		options["base-url"] ||
		process.env.API_BASE_URL ||
		envFileValues.API_BASE_URL;
	let apiKey = process.env.API_KEY || envFileValues.API_KEY;

	if (!baseUrl)
		baseUrl = await prompt(
			"API base URL (e.g. https://clarityinformatics.azure-api.net/nice/v2/): "
		);
	if (!apiKey)
		apiKey = await prompt("API key (input hidden): ", { hidden: true });
	if (!baseUrl || !apiKey)
		fail("both an API base URL and an API key are required");

	// Same rule as gatsby-config.js: CHANGES_SINCE if set, else last month
	const changesSince = process.env.CHANGES_SINCE || envFileValues.CHANGES_SINCE;
	const changesSinceDate = changesSince
		? new Date(changesSince)
		: defaultChangesSinceDate();
	if (Number.isNaN(changesSinceDate.getTime()))
		fail(`CHANGES_SINCE isn't a valid date: ${changesSince}`);

	console.log(`Base URL: ${baseUrl}`);
	console.log(
		`Env file: ${envFile}${fs.existsSync(envFile) ? "" : " (not found)"}\n`
	);

	const topics = await checkHealth(baseUrl, apiKey, changesSinceDate);
	if (options.quick) return 0;

	console.log(`Checking ${topics.length} topics...\n`);

	// Only show a progress counter when writing to a real terminal
	const showProgress = process.stdout.isTTY;
	const clearProgress = () => showProgress && process.stdout.write("\r\x1b[K");

	// One request at a time: gentler on the API than the build (5 in parallel)
	let failed = 0;
	const timings = [];
	const scanStart = performance.now();
	for (const [i, topic] of topics.entries()) {
		if (showProgress) process.stdout.write(`\r[${i + 1}/${topics.length}] `);

		const url = `${baseUrl}${topic.currentVersionLink}`;
		const result = await fetchJson(url, apiKey);
		timings.push({ name: topic.name, seconds: result.seconds });
		if (result.problem) {
			failed++;
			clearProgress();
			const hint = explainStatus(result.status);
			console.log(
				`FAIL  ${topic.name} (${topic.id}): ${result.problem}${
					hint ? ` - ${hint}` : ""
				}\n      ${url}`
			);
		}
	}
	clearProgress();

	// Timing summary: slow topics make the build's sourcing step slow, and are
	// often the first sign of an API problem
	const totalSeconds = (performance.now() - scanStart) / 1000;
	const slowest = [...timings]
		.sort((a, b) => b.seconds - a.seconds)
		.slice(0, 3);
	console.log(
		`${failed ? "\n" : ""}Took ${formatSeconds(totalSeconds)} (average ${formatSeconds(
			totalSeconds / topics.length
		)} per topic). Slowest: ${slowest
			.map((t) => `${t.name} ${formatSeconds(t.seconds)}`)
			.join(", ")}`
	);

	if (failed === 0) {
		console.log(`All ${topics.length} topics returned valid JSON`);
		return 0;
	}
	console.log(`${failed} of ${topics.length} topics failed`);
	return 1;
};

// Set exitCode rather than calling process.exit(): exiting while fetch still
// has keep-alive sockets open can crash Node on Windows (libuv assertion).
main().then(
	(exitCode) => {
		process.exitCode = exitCode;
	},
	(e) => {
		console.error(e instanceof SetupError ? `Error: ${e.message}` : e);
		process.exitCode = 2;
	}
);
