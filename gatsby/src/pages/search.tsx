import React, { useState, useEffect } from "react";
import { PageRendererProps, Link } from "gatsby";
import parser from "react-html-parser";
import { Card } from "@nice-digital/nds-card";
import { SimplePagination } from "@nice-digital/nds-simple-pagination";

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

	originalSearch:
		| {
				searchText: string;
		  }
		| string;
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

	const ResultSummary: React.FC = () => {
		const { resultCount, finalSearchText, originalSearch } = data;

		if (resultCount === 0) {
			return <NoResults searchText={finalSearchText} />;
		}

		return (
			<>
				<p>
					{originalSearch?.searchText && (
						<>
							Your search for <b>{originalSearch.searchText}</b> returned no
							results
							<br />
						</>
					)}
					{resultCount} {resultCount === 1 ? "result" : "results"}
					{finalSearchText && (
						<>
							{" "}
							for <b>{finalSearchText}</b>
						</>
					)}
				</p>
			</>
		);
	};

	const Results: React.FC = () => (
		<ul className="list--unstyled">
			{data?.documents.map(({ id, title, pathAndQuery, teaser }) => (
				<li key={id}>
					<Card
						summary={parser(teaser)}
						headingText={parser(title)}
						link={{ destination: `/topics/${pathAndQuery}`, elementType: Link }}
					/>
				</li>
			))}
		</ul>
	);

	const Pagination: React.FC = () => {
		const { next, previous } = data.pagerLinks;
		const pages = data.pagerLinks.pages;
		const previousPageLink = previous?.fullUrl
			? { destination: "/" + previous.fullUrl, elementType: Link }
			: undefined;
		const nextPageLink = next?.fullUrl
			? { destination: "/" + next.fullUrl, elementType: Link }
			: undefined;
		const props = {
			currentPage: 1,
			totalPages: pages.length,
			previousPageLink,
			nextPageLink,
		};
		return <SimplePagination {...props} />;
	};

	return (
		<Layout>
			<SEO title="Search results" noIndex={true} />
			<h1>Search</h1>
			{!data && <div>Loading</div>}
			{data && data.failed && <div>Failed to load results</div>}
			{data && !data.failed && (
				<>
					<ResultSummary />
					<Results />
					{data.pagerLinks?.pages.length > 1 && <Pagination />}
				</>
			)}
		</Layout>
	);
};

interface NoResultsProps {
	searchText: SearchResults["finalSearchText"];
}

const NoResults: React.FC<NoResultsProps> = ({
	searchText,
}: NoResultsProps) => (
	<>
		<h1>No results found</h1>
		<p>
			We couldn&apos;t find any results for <b>{searchText}</b>
		</p>
		<p>Check for spelling mistakes or try another search term.</p>
		<h2>Browse for topics</h2>
		<p>Try browsing for topics with our:</p>
		<ul>
			<li>
				<Link to={"/topics"}>A-Z list</Link>
			</li>
			<li>
				<Link to={"/specialities"}>Clinical specialities</Link>
			</li>
		</ul>
		<h2>Check our other services</h2>
		<p>
			See if there are search results for <b>{searchText}</b> on our other
			services:
		</p>
		<ul>
			<li>
				<a
					rel="noreferrer"
					target="_blank"
					href={`https://bnf.nice.org.uk/#Search?q=${searchText}`}
				>
					BNF
				</a>
			</li>
			<li>
				<a
					rel="noreferrer"
					target="_blank"
					href={`https://bnfc.nice.org.uk/#Search?q=${searchText}`}
				>
					BNFc
				</a>
			</li>
			<li>
				<a
					rel="noreferrer"
					target="_blank"
					href={`https://www.evidence.nhs.uk/search?q=${searchText}`}
				>
					Evidence search
				</a>
			</li>
			<li>
				<a
					rel="noreferrer"
					target="_blank"
					href={`https://www.nice.org.uk/search?om=[{%22ndt%22:[%22Guidance%22]}]&ps=15&q=${searchText}&sp=on`}
				>
					NICE guidance
				</a>
			</li>
		</ul>
		<h3>What are our other services?</h3>
		<h4>BNF and BNFc</h4>
		<p>
			Drug and prescribing information for healthcare professionals. A reference
			for correct dosage, indication, interaction and side effects of drugs.
		</p>
		<h4>Evidence search</h4>
		<p>
			A search engine for selected, authoritative evidence in health, social
			care and public health. Brings together high-quality evidence from
			hundreds of trusted sources. Includes guidance, systematic reviews,
			evidence summaries, and patient information.
		</p>
		<h4>NICE guidance</h4>
		<p>
			We use the best available evidence to develop recommendations that guide
			decisions in health, public health and social care.
		</p>
	</>
);

export default SearchPage;
