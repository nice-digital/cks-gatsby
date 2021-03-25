const LambdaTester = require("lambda-tester");

const originRequestHandler = require("../index").handler;

const fromNonUkTestObject = require("./fromNonUkTestObject.json");
const fromUkTestObject = require("./fromUkTestObject.json");

describe("handler", function () {
	it("request from non uk", async function () {
		await LambdaTester(originRequestHandler)
			.event(fromNonUkTestObject)
			.expectResult((result) => {
				expect(result.status).toEqual("403");
			});
	});
});

describe("handler", function () {
	it("request from uk", async function () {
		await LambdaTester(originRequestHandler)
			.event(fromUkTestObject)
			.expectResult((result) => {
				expect(result.status).not.toEqual("403");
			});
	});
});
