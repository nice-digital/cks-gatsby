import React from "react";
import { PreRenderHTMLArgs } from "gatsby";

export const onPreRenderHTML = ({
	getHeadComponents,
	replaceHeadComponents,
}: PreRenderHTMLArgs): void => {
	const components = getHeadComponents();

	components.push(
		<script
			src="https://alpha-cdn.nice.org.uk/cookie-banner/cookie-banner.min.js"
			type="text/javascript"
			key="cookie-banner"
			async
		></script>
	);

	replaceHeadComponents(components);
};
