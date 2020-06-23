import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { Card } from "@nice-digital/nds-card";
import { SimplePagination } from "@nice-digital/nds-simple-pagination";
import { Alert } from "@nice-digital/nds-alert";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

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

function titleString(searchText: string, pageIndex: number): string {
	return [pageIndex > 1 && `Page ${pageIndex}`, searchText, "Search results"]
		.filter(Boolean)
		.join(" | ");
}

const SearchPage: React.FC = () => {
	const [data, setData] = useState<SearchResults | null>(null);
	const [error, setError] = useState<Error | null>();

	useEffect(() => {
		setData(null);
		fetch("/api/search" + window.location.search)
			.then(data => data.json())
			.then(results => {
				setError(null);
				setData(results as SearchResults);
			})
			.catch(e => setError(e));
	}, [window.location.search]);

	return (
		<Layout>
			{!error && !data && (
				<PageHeader heading="Search results" lead="loading" />
			)}
			{error?.message && <ErrorBlock error={error} />}
			{data && data.failed && <div>Failed to load results</div>}
			{data && !data.failed && <Results {...data} />}
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
		nextPageLink:
			(next?.fullUrl && {
				destination: "/" + next.fullUrl,
				elementType: Link,
			}) ||
			undefined,
		previousPageLink:
			(previous?.fullUrl && {
				destination: "/" + previous.fullUrl,
				elementType: Link,
			}) ||
			undefined,
		currentPage,
		totalPages,
	};

	return (
		<>
			<SEO title={titleString(finalSearchText, currentPage)} noIndex={true} />
			<ResultSummary
				resultCount={resultCount}
				finalSearchText={finalSearchText}
				originalSearchText={originalSearch?.searchText}
			/>
			{documents.length > 0 && <ResultsList documents={documents} />}
			{resultCount > pageSize && <SimplePagination {...paginationProps} />}
		</>
	);
};

interface ResultsSummary {
	resultCount: number;
	finalSearchText: string;
	originalSearchText: string;
}

const ResultSummary: React.FC<ResultsSummary> = ({
	resultCount,
	finalSearchText,
	originalSearchText,
}) => {
	if (resultCount === 0) {
		const searchTerm = originalSearchText
			? originalSearchText
			: finalSearchText;
		return (
			<>
				<PageHeader
					heading="No results found"
					lead={
						<span
							dangerouslySetInnerHTML={{
								__html: `We couldn&apos;t find any results for <b>${searchTerm}</b>
								<br />
								Check for spelling mistakes or try another search term.`,
							}}
						/>
					}
				/>
				<NoResults searchText={searchTerm} />
			</>
		);
	}

	const LeadText = (
		<>
			{originalSearchText && (
				<>
					Your search for <b>{originalSearchText}</b> returned no results
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
		</>
	);

	return <PageHeader heading="Search results" lead={LeadText} />;
};

interface ResultsList {
	documents: Document[];
}

const ResultsList: React.FC<ResultsList> = ({ documents }) => (
	<ol className="list--unstyled">
		{documents?.map(({ id, title, pathAndQuery, teaser }) => (
			<li key={id}>
				<Card
					summary={<span dangerouslySetInnerHTML={{ __html: teaser }} />}
					headingText={<span dangerouslySetInnerHTML={{ __html: title }} />}
					link={{ destination: `${pathAndQuery}`, elementType: Link }}
				/>
			</li>
		))}
	</ol>
);

interface NoResultsProps {
	searchText: string;
}

const NoResults: React.FC<NoResultsProps> = ({
	searchText,
}: NoResultsProps) => (
	<>
		<section>
			<h3>Browse for topics</h3>
			<p>Try browsing for topics with our:</p>
			<ul>
				<li>
					<Link to={"/topics/"}>A-Z list</Link>
				</li>
				<li>
					<Link to={"/specialities/"}>Clinical specialities</Link>
				</li>
			</ul>
		</section>
		<section>
			<h3>Check our other services</h3>
			<p>
				See if there are search results for <b>{searchText}</b> on our other
				services:
			</p>
			<ul aria-label={`Search for "${searchText}" on our other services`}>
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
		</section>
		<section>
			<h4>What are our other services?</h4>
			<h5>BNF and BNFc</h5>
			<p>
				Drug and prescribing information for healthcare professionals. A
				reference for correct dosage, indication, interaction and side effects
				of drugs.
			</p>
			<h5>Evidence search</h5>
			<p>
				A search engine for selected, authoritative evidence in health, social
				care and public health. Brings together high-quality evidence from
				hundreds of trusted sources. Includes guidance, systematic reviews,
				evidence summaries, and patient information.
			</p>
			<h5>NICE guidance</h5>
			<p>
				We use the best available evidence to develop recommendations that guide
				decisions in health, public health and social care.
			</p>
		</section>
	</>
);

const ErrorBlock: React.FC<{ error: Error }> = ({
	error: { name, message, stack },
}) => {
	if (process?.env.GATSBY_ENV === "development")
		return (
			<Alert type="error">
				<pre>
					{name}
					<br />
					{message}
					<br />
					{stack}
				</pre>
			</Alert>
		);
	return (
		<PageHeader
			heading="Error"
			lead="We are currently experiencing issues with search. The issue will be
	resolved as soon as possible. We apologise for any inconvenience caused.
"
		/>
	);
};

const Announcer: React.FC<{ message: string }> = ({ message }) => {
	return (
		<div /*className="visually-hidden"*/ aria-live="polite">{message}</div>
	);
};

export default SearchPage;
