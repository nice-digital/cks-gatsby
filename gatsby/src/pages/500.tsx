import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Link } from "gatsby";

const ServerErrorPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="Something went wrong" noIndex={true} />
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb>Something went wrong</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading={"Something went wrong"}
				lead={"Something went wrong with the page you requested."}
			/>

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

export default ServerErrorPage;
