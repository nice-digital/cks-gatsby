import React, { useState, useEffect } from "react";
import { PageRendererProps, Link } from "gatsby";
import parser from "react-html-parser";
import { Card } from "@nice-digital/nds-card";

import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

type SearchPageProps = PageRendererProps;

interface SearchResults {
	failed: boolean;
	resultCount: number;
	firstResult: number;
	lastResult: number;
	finalSearchText: string;
	finalSearchTextNoStopWords: string;
	originalSearch: string | null;
	pagerLinks: {
		previous: {
			fullUrl: string;
		} | null;
		next: {
			fullUrl: string;
		} | null;
		pages: {
			title: string;
			url: {
				fullUrl: string;
			};
			isCurrent: boolean;
		}[];
	};
	documents: {
		id: string;
		metaDescription: string;
		contentId: string;
		pathAndQuery: string;
		sourceUrl: string;
		teaser: string;
		title: string;
		url: string;
	}[];
}

const searchPath = "/api/search";

const SearchPage: React.FC<SearchPageProps> = ({
	location,
}: SearchPageProps) => {
	const [data, setData] = useState<SearchResults | null>(null);

	useEffect(() => {
		setData(null);
		fetch(searchPath + window.location.search)
			.then(data => data.json())
			.then(results => setData(results as SearchResults));
	}, [location.search]);

	const Results: React.FC = () => (
		<ul className="list--unstyled">
			{data?.documents.map(({ id, title, pathAndQuery, teaser }) => (
				<li key={id}>
					<Card
						summary={parser(teaser)}
						headingText={parser(title)}
						link={{ destination: pathAndQuery, elementType: Link }}
					/>
				</li>
			))}
		</ul>
	);

	return (
		<Layout>
			<SEO title="Search" />
			<h1>Search</h1>
			{!data && <div>Loading</div>}
			{data && data.failed && <div>Failed to load results</div>}
			{data && !data.failed && <Results />}
		</Layout>
	);
};

export default SearchPage;
