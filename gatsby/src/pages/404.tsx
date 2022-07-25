import React from "react";
import { SEO } from "../components/SEO/SEO";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Link } from "gatsby";

const NotFoundPage: React.FC = () => {
	return (
		<>
			<SEO title="Page not found" noIndex={true} />
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb>Page not found</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				id="content-start"
				heading={"We can't find this page"}
				lead={"Check that the web address has been typed correctly."}
			/>

			<p>You can also try:</p>
			<ul>
				<li>looking for it using the search box</li>
				<li>
					browsing for it from the <Link to="/">CKS homepage</Link>.
				</li>
			</ul>
			<h2>Contact us</h2>
			<p>
				<a href="https://www.nice.org.uk/get-involved/contact-us">
					Get in touch
				</a>{" "}
				if you think there is a problem.
			</p>
		</>
	);
};

export default NotFoundPage;
