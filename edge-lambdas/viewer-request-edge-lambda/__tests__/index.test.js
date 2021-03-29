const LambdaTester = require("lambda-tester");

const originRequestHandler = require("../index").handler;

const fromNonUkAllowedIp = require("./fromNonUkAllowedIp.json");
const fromNonUkNotAllowedIp = require("./fromNonUkNotAllowedIp.json");

describe("handler", function () {
	it("request from non uk allowed ip", async function () {
		await LambdaTester(originRequestHandler)
			.event(fromNonUkAllowedIp)
			.expectResult((result) => {
				expect(result.headers["x-nice-allowed-ip"]);
				expect(result.headers["x-nice-allowed-ip"][0].value).toEqual(
					"169.254.1.6"
				);
			});
	});
});

describe("handler", function () {
	it("request from non uk not allowed ip", async function () {
		await LambdaTester(originRequestHandler)
			.event(fromNonUkNotAllowedIp)
			.expectResult((result) => {
				expect(result.headers["x-nice-allowed-ip"]).toBeUndefined();
			});
	});
});
