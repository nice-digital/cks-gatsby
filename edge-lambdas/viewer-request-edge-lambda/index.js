var Netmask = require("netmask").Netmask;

const ipAllowList = require("./ipAllowList.json");

exports.handler = (event, context, callback) => {
	let request = event.Records[0].cf.request;
	const headers = request.headers;
	console.log("Input request " + JSON.stringify(request));

	if (isInIpAllowList(request.clientIp)) {
		//if request is in ip allow list
		headers["x-nice-allowed-ip"] = [
			{
				key: "x-nice-allowed-ip",
				value: request.clientIp,
			},
		];
	}
	console.log("Out request " + JSON.stringify(request));
	callback(null, request);
};

function isInIpAllowList(sourceIpAddress) {
	console.log(sourceIpAddress);
	var netBlockArray = ipAllowList.map((addressMask) => {
		const block = new Netmask(addressMask);
		if (block.contains(sourceIpAddress)) {
			console.log(sourceIpAddress - "true");
			return true;
		}
		return false;
	});

	return netBlockArray.includes(true);
}
