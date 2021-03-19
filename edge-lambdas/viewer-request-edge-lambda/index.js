var Netmask = require("netmask").Netmask;

const ipAllowList = require("./ipAllowList.json");

exports.handler = (event, context, callback) => {
	let request = event.Records[0].cf.request;
	const headers = request.headers;

	if (isInIpAllowList(request.clientIp)) {
		//if request is in ip allow list
		headers["x-nice-allowed-ip"] = [
			{
				key: "x-nice-allowed-ip",
				value: request.clientIp,
			},
		];
	}
	callback(null, request);
};

function isInIpAllowList(sourceIpAddress) {
	var netBlockArray = ipAllowList.map((addressMask) => {
		const block = new Netmask(addressMask);
		if (block.contains(sourceIpAddress)) {
			return true;
		}
		return false;
	});

	return netBlockArray.includes(true);
}
