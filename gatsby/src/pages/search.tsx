import React, { useState, useEffect } from "react";
import { PageRendererProps, Link } from "gatsby";
import parser from "react-html-parser";
import { Card } from "@nice-digital/nds-card";
import { SimplePagination } from "@nice-digital/nds-simple-pagination";
import { Alert } from "@nice-digital/nds-alert";

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
	pageSize: number;
	originalSearch: {
		searchText: string;
	};
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
	documents: Document[];
}

type Document = {
	id: string;
	metaDescription: string;
	contentId: string;
	pathAndQuery: string;
	sourceUrl: string;
	teaser: string;
	title: string;
	url: string;
};

function titleString(text: string, page: number): string {
	return text
		? page > 1
			? `Page ${page} | ${text} | `
			: `${text} | `
		: page > 1
		? `Page ${page} | `
		: "";
}

const SearchPage: React.FC<SearchPageProps> = ({
	location,
}: SearchPageProps) => {
	const [data, setData] = useState<SearchResults | null>(null);
	const [error, setError] = useState<Error>();

	useEffect(() => {
		setData(null);
		fetch("/api/search" + window.location.search)
			.then(data => data.json())
			.then(results => setData(results as SearchResults))
			.catch(e => setError(e));
	}, [location.search]);

	return (
		<Layout>
			<h1>Search</h1>
			{!error && !data && <div>Loading</div>}
			{data && data.failed && <div>Failed to load results</div>}
			{data && !data.failed && <Results {...data} />}
			{error?.message && (
				<Alert type="error">
					<pre>
						{error.name}
						<br />
						{error.message}
						<br />
						{error.stack}
					</pre>
				</Alert>
			)}
		</Layout>
	);
};

const Results: React.FC<SearchResults> = ({
	firstResult,
	resultCount,
	finalSearchText,
	originalSearch,
	documents,
	pageSize,
	pagerLinks: { next, previous },
}) => {
	const currentPage = Math.ceil(firstResult / pageSize);
	const totalPages = Math.ceil(resultCount / pageSize);
	const paginationProps = {
		nextPageLink: next?.fullUrl
			? { destination: "/" + next?.fullUrl, elementType: Link }
			: undefined,
		previousPageLink: previous?.fullUrl
			? { destination: "/" + previous?.fullUrl, elementType: Link }
			: undefined,
		currentPage,
		totalPages,
	};

	return (
		<>
			<SEO
				title={`${titleString(finalSearchText, currentPage)}Search results`}
				noIndex={true}
			/>
			<ResultSummary
				resultCount={resultCount}
				finalSearchText={finalSearchText}
				originalSearch={originalSearch?.searchText}
			/>
			{documents.length > 0 && <ResultsList documents={documents} />}
			{resultCount > pageSize && <SimplePagination {...paginationProps} />}
		</>
	);
};

interface ResultsSummary {
	resultCount: number;
	finalSearchText: string;
	originalSearch: string;
}

const ResultSummary: React.FC<ResultsSummary> = ({
	resultCount,
	finalSearchText,
	originalSearch,
}) => {
	if (resultCount === 0) {
		return <NoResults searchText={finalSearchText} />;
	}

	return (
		<>
			<p>
				{originalSearch && (
					<>
						Your search for <b>{originalSearch}</b> returned no results
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

interface ResultsList {
	documents: Document[];
}

const ResultsList: React.FC<ResultsList> = ({ documents }) => (
	<ul className="list--unstyled">
		{documents?.map(({ id, title, pathAndQuery, teaser }) => (
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

interface NoResultsProps {
	searchText: string;
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
