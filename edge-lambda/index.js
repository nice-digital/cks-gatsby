exports.handler = (event, context, callback) => {
	const redirectResponse = {
		status: "403",
		statusDescription: "Forbidden",
	};
	callback(null, redirectResponse);
};
