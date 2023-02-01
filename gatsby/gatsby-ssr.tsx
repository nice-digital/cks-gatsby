import React, { ReactElement } from "react";
import {
	type PreRenderHTMLArgs,
	type WrapPageElementBrowserArgs,
} from "gatsby";
import { Layout } from "./src/components/Layout/Layout";

const isGeneratorTag = (
	type: string | React.JSXElementConstructor<unknown>,
	name: string
) => type === "meta" && name === "generator";

export const onPreRenderHTML = (
	{ getHeadComponents, replaceHeadComponents }: PreRenderHTMLArgs,
	{ removeVersionOnly = false, content }
): void => {
	const components = getHeadComponents();
	const keepTag = removeVersionOnly || content != undefined;

	const headComponents = getHeadComponents()
		.map((c) =>
			React.isValidElement(c) &&
			isGeneratorTag(c.type, c.props ? c.props.name : "")
				? Object.assign({}, c, {
						props: Object.assign({}, c.props, { content: content || "Gatsby" }),
				  })
				: c
		)
		.filter((c) =>
			keepTag
				? true
				: React.isValidElement(c) &&
				  !isGeneratorTag(c.type, c.props?.name || "")
		);

	replaceHeadComponents(headComponents);

	components.push(
		<script
			src="https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js"
			type="text/javascript"
			key="cookie-banner"
			async
		></script>
	);

	components.push(
		<>
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
			<link
				href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Lora:ital,wght@0,600;1,600&display=swap"
				rel="stylesheet"
			/>
		</>
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

export const wrapPageElement = ({
	element,
	props,
}: WrapPageElementBrowserArgs): ReactElement => (
	<Layout {...props}>{element}</Layout>
);
