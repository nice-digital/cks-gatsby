import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { useSiteMetadata } from "../hooks/useSiteMetadata";

const ForbiddenPage: React.FC = () => {
	const { siteUrl } = useSiteMetadata();
	return (
		<Layout>
			<SEO title="CKS is only available in the UK" noIndex={true} />
			<PageHeader
				heading={"CKS is only available in the UK"}
				lead={
					"The NICE Clinical Knowledge Summaries (CKS) site is only available to users in the UK, Crown Dependencies and British Overseas Territories."
				}
			/>
			<p>
				CKS content is produced by Clarity Informatics Limited. It is available
				to users outside the UK via subscription from the{" "}
				<a href="https://prodigy.clarity.co.uk/">Prodigy website</a>.
			</p>
			<p>
				<img
					alt="Logo for Clarity Consulting"
					src={`${siteUrl}/cks-clarity-logo.png`}
				/>
			</p>

			<h2>Contact us</h2>
			<p>
				<a href="https://www.nice.org.uk/get-involved/contact-us">
					Get in touch
				</a>{" "}
				if you think there is a problem.
			</p>
		</Layout>
	);
};

export default ForbiddenPage;
