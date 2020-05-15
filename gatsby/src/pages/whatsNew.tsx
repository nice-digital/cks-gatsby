import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

const WhatsNewPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="What's new" />
			<h1>What&apos;s new</h1>
		</Layout>
	);
};

export default WhatsNewPage;
