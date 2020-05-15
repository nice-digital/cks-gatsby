import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

const NotFoundPage: React.FC = () => {
	return (
		<Layout>
			<meta name="robots" content="noindex" />
			<SEO title="Page not found" />
			<h1>Page not found</h1>
		</Layout>
	);
};

export default NotFoundPage;
