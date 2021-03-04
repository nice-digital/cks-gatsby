const allowedCounties = require("./allowedCounties.json").map(({ country }) => [
	country,
]);

const redirects = require("./redirects.json").map(
	({ source, destination }) => ({
		source: new RegExp(source),
		destination,
	})
);

exports.handler = async (event) => {
	const request = event.Records[0].cf.request;

	for (const { source, destination } of redirects) {
		if (source.test(request.uri)) {
			return {
				status: "302",
				statusDescription: "Found",
				headers: {
					location: [{ value: request.uri.replace(source, destination) }],
				},
			};
		}
	}

	return request;
};
