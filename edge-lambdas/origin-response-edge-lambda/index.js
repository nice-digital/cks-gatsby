exports.handler = async (event, context) => {
	const response = event.Records[0].cf.response;
	const headers = response.headers;

	headers["content-security-policy"] = [
		{
			key: "Content-Security-Policy",
			value: "frame-ancestors 'self'",
		},
	];
	headers["x-content-type-options"] = [
		{ key: "X-Content-Type-Options", value: "nosniff" },
	];
	headers["x-frame-options"] = [
		{ key: "X-Frame-Options", value: "SAMEORIGIN" },
	];
	headers["x-xss-protection"] = [
		{ key: "X-XSS-Protection", value: "1; mode=block" },
	];
	headers["referrer-policy"] = [
		{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	];
	headers["link"] = [
		{
			key: "link",
			value:
				// "<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin,<https://www.googletagmanager.com>; rel=preconnect,<https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel=preload; as=script,</fonts/lato-v17-latin-regular.woff2>; rel=preload; as=font; crossorigin=anonymous,</fonts/lato-v17-latin-italic.woff2>; rel=preload; as=font; crossorigin=anonymous,</fonts/lato-v17-latin-700.woff2>; rel=preload; as=font; crossorigin=anonymous,</fonts/lato-v17-latin-900.woff2>; rel=preload; as=font; crossorigin=anonymous",
				"<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin,<https://www.googletagmanager.com>; rel=preconnect,<https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel=preload; as=script",
		},
	];

	return response;
};
