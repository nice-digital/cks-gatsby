import React from "react";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

const SearchPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="Search" />
			<h1>Search</h1>
		</Layout>
	);
};

export default SearchPage;
