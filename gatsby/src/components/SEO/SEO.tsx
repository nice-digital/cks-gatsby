import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "@reach/router";
import { useSiteMetadata } from "../../hooks/useSiteMetadata";

const defaultDescription =
	"Providing primary care practitioners with a readily accessible summary of the current evidence base and practical guidance on best practice";

interface MetaDatum {
	name: string;
	content: string;
}

interface SEOProps {
	title?: string;
	description?: string;
	noIndex?: boolean;
	additionalMetadata?: Array<MetaDatum>;
}

export const SEO: React.FC<SEOProps> = ({
	title,
	description,
	noIndex,
	additionalMetadata,
}: SEOProps) => {
	const { pathname } = useLocation();
	const { siteUrl } = useSiteMetadata();

	return (
		<>
			<Helmet
				title={title}
				titleTemplate={`%s | CKS | NICE`}
				defaultTitle="CKS | NICE"
			>
				<html lang="en-GB" />
				<meta name="description" content={description || defaultDescription} />
				<meta
					property="og:description"
					content={description || defaultDescription}
				/>
				<meta property="og:url" content={siteUrl + pathname} />
				<meta property="og:locale" content="en_GB" />
				<meta property="og:type" content="website" />
				<meta
					property="og:title"
					content={(title ? `${title} | ` : "") + "CKS | NICE"}
				/>
				<meta property="og:image" content={`${siteUrl}/open-graph-image.png`} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta name="twitter:card" content="summary" />
				<meta
					name="twitter:image"
					content={`${siteUrl}/twitter-summary-image.png`}
				/>
				<meta name="twitter:image:alt" content="NICE and CKS logos" />
				<meta name="twitter:site" content="@NICEcomms" />
				<meta name="twitter:creator" content="@NICEcomms" />
				<meta name="theme-color" content="#004650" />
				{additionalMetadata?.map((x, i) => (
					<meta key={i} name={x.name} content={x.content} />
				))}
				{noIndex && <meta name="robots" content="noindex" />}
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					href="/opensearch.xml"
					title="CKS"
				/>
				<link rel="icon" href="/favicon.ico" />
				<link rel="canonical" href={siteUrl + pathname} />
			</Helmet>
		</>
	);
};
