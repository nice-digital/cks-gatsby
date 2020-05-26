import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { SEO } from "../../components/SEO/SEO";

const AboutPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="About" />
			<h1>About</h1>
		</Layout>
	);
};

export default AboutPage;
