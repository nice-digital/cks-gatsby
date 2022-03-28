import React, { ReactElement } from "react";
import { PreRenderHTMLArgs } from "gatsby";

export const onPreRenderHTML = ({
	getHeadComponents,
	replaceHeadComponents,
}: PreRenderHTMLArgs): void => {
	const components = getHeadComponents();

	components.push(
		<script
			src="https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js"
			type="text/javascript"
			key="cookie-banner"
			async
		></script>
	);

	// Rewrite inline CSS into external link tags as per https://github.com/gatsbyjs/gatsby/issues/1526
	// This reduces the bundle size as it was getting over 350Mb
	if (process.env.NODE_ENV === "production") {
		components
			.filter<ReactElement>(
				(el): el is ReactElement =>
					(el as ReactElement).type === "style" &&
					(el as ReactElement).props["data-href"]
			)
			.forEach((el) => {
				el.type = "link";
				el.props["href"] = el.props["data-href"];
				el.props["rel"] = "stylesheet";
				el.props["type"] = "text/css";

				delete el.props["data-href"];
				delete el.props["dangerouslySetInnerHTML"];
				delete el.props["children"];
			});
	}

	replaceHeadComponents(components);
};
