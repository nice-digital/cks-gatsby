const allowedCounties = [
	"GB",
	"IO",
	"GI",
	"BM",
	"FK",
	"GS",
	"SH",
	"MS",
	"VG",
	"KY",
	"TC",
	"AI",
	"PN",
	"IM",
	"GG",
	"JE",
];

exports.handler = (event, context, callback) => {
	let request = event.Records[0].cf.request;
	const countryHeader = request.headers["cloudfront-viewer-country"];
	const countryCode = countryHeader[0].value;

	if (allowedCounties.includes(countryCode)) {
		callback(null, request);
	} else {
		const redirectResponse = {
			status: "403",
			statusDescription: "Forbidden",
		};
		callback(null, redirectResponse);
	}
};
