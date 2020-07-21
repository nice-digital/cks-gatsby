import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { Link } from "gatsby";

const NotFoundPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="Page not found" noIndex={true} />
			<h1>We can't find this page</h1>
			<p>Check that the web address has been typed correctly.</p>
			You can also try:
			<ul>
				<li>Look for it using the search box</li>
				<li>
					Browse for it from the <Link to="/">CKS homepage.</Link>
				</li>
			</ul>
			<h2>Contact us</h2>
			<a href="https://www.nice.org.uk/get-involved/contact-us">
				Get in touch
			</a>{" "}
			if you think there is a problem.
		</Layout>
	);
};

export default NotFoundPage;
