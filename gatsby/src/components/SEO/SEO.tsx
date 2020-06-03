import React from "react";
import { Helmet } from "react-helmet";

const defaultDescription =
	"Providing primary care practitioners with a readily accessible summary of the current evidence base and practical guidance on best practice";

type SEOProps = {
	title?: string;
	description?: string;
};

export const SEO: React.FC<SEOProps> = ({ title, description }: SEOProps) => (
	<Helmet
		title={title}
		titleTemplate={`%s | CKS | NICE`}
		defaultTitle="CKS | NICE"
		meta={[
			{
				name: `description`,
				content: description || defaultDescription,
			},
			{
				property: `og:description`,
				content: description || defaultDescription,
			},
			{
				property: `og:locale`,
				content: "en_GB",
			},
			{
				property: `og:type`,
				content: `website`,
			},
			{
				property: `og:title`,
				content: (title ? `${title} | ` : "") + "CKS | NICE",
			},
			{
				property: `og:image`,
				content: "https://cks.nice.org.uk/open-graph-image.png",
			},
			{
				property: `og:image:width`,
				content: "1200",
			},
			{
				property: `og:image:height`,
				content: "630",
			},
			{
				name: `twitter:card`,
				content: `summary`,
			},
			{
				name: `twitter:site`,
				content: "@NICEcomms",
			},
			{
				name: `twitter:creator`,
				content: "@NICEcomms",
			},
			{
				name: `theme-color`,
				content: "#004650",
			},
		]}
	>
		<html lang="en-GB" />
		<link rel="icon" href="/favicon.ico" />
	</Helmet>
);
