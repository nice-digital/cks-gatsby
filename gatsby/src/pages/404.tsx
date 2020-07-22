import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { Link } from "gatsby";

const NotFoundPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="Page not found" noIndex={true} />
			<header role="banner" className="page-header">
				<h1>We can't find this page</h1>
				<p className="lead">
					Check that the web address has been typed correctly.
				</p>
			</header>

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
		</Layout>
	);
};

export default NotFoundPage;
