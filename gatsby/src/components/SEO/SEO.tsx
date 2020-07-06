import React from "react";
import { Helmet } from "react-helmet";

const defaultDescription =
	"Providing primary care practitioners with a readily accessible summary of the current evidence base and practical guidance on best practice";

type SEOProps = {
	title?: string;
	description?: string;
	noIndex?: boolean;
	additionalMetadata?: Array<Array<string>>;
};

export const SEO: React.FC<SEOProps> = ({
	title,
	description,
	noIndex,
	additionalMetadata,
}: SEOProps) => (
	<>
		<Helmet
			title={title}
			titleTemplate={`%s | CKS | NICE`}
			defaultTitle="CKS | NICE"
		>
			<meta name="description" content={description || defaultDescription} />
			<meta
				property="og:description"
				content={description || defaultDescription}
			/>
			<meta property="og:locale" content="en_GB" />
			<meta property="og:type" content="website" />
			<meta
				property="og:title"
				content={(title ? `${title} | ` : "") + "CKS | NICE"}
			/>
			<meta
				property="og:image"
				content="https://cks.nice.org.uk/open-graph-image.png"
			/>
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content="@NICEcomms" />
			<meta name="twitter:creator" content="@NICEcomms" />
			<meta name="theme-color" content="#004650" />
			{additionalMetadata?.map((x, i) => (
				<meta key={i} name={x[0]} content={x[1]} />
			))}
			{noIndex && <meta name="robots" content="noindex" />}
			<link
				rel="search"
				type="application/opensearchdescription+xml"
				href="/opensearch.xml"
				title="CKS"
			/>
			<html lang="en-GB" />
			<link rel="icon" href="/favicon.ico" />
		</Helmet>
	</>
);
