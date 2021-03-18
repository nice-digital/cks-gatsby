const LambdaTester = require("lambda-tester");

const originRequestHandler = require("../index").handler;

const fromNonUkTestObject = require("../fromNonUkTestObject.json");
const fromNonUkTestObjectInAllowList = require("../fromNonUkTestObjectInAllowList.json");

describe("handler", function () {
	it("test request from non uk", async function () {
		await LambdaTester(originRequestHandler)
			.event(fromNonUkTestObject)
			.expectResult((result) => {
				expect(result.status).toEqual("403");
			});
	});
});

describe("handler", function () {
	it("test request from non uk in whitelist", async function () {
		await LambdaTester(originRequestHandler)
			.event(fromNonUkTestObjectInAllowList)
			.expectResult((result) => {
				// expect(result.status).toEqual("403");
			});
	});
});
