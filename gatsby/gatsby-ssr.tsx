import React from "react";
import { RenderBodyArgs } from "gatsby";

export const onRenderBody = ({
	pathname,
	setHeadComponents,
}: RenderBodyArgs): void => {
	setHeadComponents([
		<link
			rel="canonical"
			href={`https://cks.nice.org.uk${pathname}`}
			key="canonical"
		/>,
		<link
			rel="og:url"
			href={`https://cks.nice.org.uk${pathname}`}
			key="og:url"
		/>,
	]);
};
