"use strict";
exports.handler = (event, context, callback) => {
	//Get contents of response
	const response = event.Records[0].cf.response;
	const headers = response.headers;

	//Set new headers
	headers["x-nice-test1"] = [{ key: "X-Nice-Test1", value: "Hello from nice" }];

	//Return modified response
	callback(null, response);
};
