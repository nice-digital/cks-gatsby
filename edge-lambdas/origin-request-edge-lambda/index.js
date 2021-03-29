const redirects = require("./redirects.json").map(
	({ source, destination }) => ({
		source: new RegExp(source),
		destination,
	})
);

const allowedCounties = require("./countryAllowList.json").map(
	(country) => country
);

exports.handler = (event, context, callback) => {
	let request = event.Records[0].cf.request;
	const countryHeader = request.headers["cloudfront-viewer-country"];
	const countryCode = countryHeader[0].value;

	console.log("Input request " + JSON.stringify(request));

	if (!isInCountryAllowList(countryCode) && !isInIpAllowList(request)) {
		//if request is from non UK country and not in ip allow list
		const redirectResponse = {
			status: "403",
			statusDescription: "Forbidden",
		};
		callback(null, redirectResponse);
		return;
	}

	for (const { source, destination } of redirects) {
		if (source.test(request.uri)) {
			//if uri matches entry in rewrite list return modified uri
			const redirectResponse = {
				status: "301",
				statusDescription: "Moved Permanently",
				headers: {
					location: [{ value: request.uri.replace(source, destination) }],
				},
			};
			callback(null, redirectResponse);
			return;
		}
	}

	callback(null, request);
};

function isInCountryAllowList(countryCode) {
	return allowedCounties.includes(countryCode);
}

function isInIpAllowList(request) {
	if (typeof request.headers["x-nice-allowed-ip"] != "undefined") {
		return true;
	}
}
