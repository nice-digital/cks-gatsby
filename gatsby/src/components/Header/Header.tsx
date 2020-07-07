import React, {
	useEffect,
	Suspense,
	lazy,
	useState,
	useMemo,
	useCallback,
} from "react";
import { navigate, useStaticQuery, graphql } from "gatsby";
import { useLocation } from "@reach/router";
import { PartialTopic } from "src/types";
import GlobalNavHeader from "./GlobalNavHeader";

const allTopicsQuery = graphql`
	query AllTopics {
		allCksTopic {
			nodes {
				...PartialTopic
			}
		}
	}
`;

const searchInputSelector = "header form[role='search'] [name='q']";

/**
 * Gets the value of the q parameter fro the given querystring
 *
 * @param queryString The query string (or 'search' from a URL)
 */
const getQueryTerm = (queryString: string): string => {
	const queryMatch = queryString.match(/q=([^&]*)/);
	return queryMatch
		? decodeURIComponent(queryMatch[1].replace(/\+/g, "%20"))
		: "";
};

interface AllTopicsQueryResults {
	allCksTopic: {
		nodes: PartialTopic[];
	};
}

export const Header: React.FC = () => {
	const { search: queryString } = useLocation();

	const [queryTerm, setQueryTermState] = useState(getQueryTerm(queryString));

	// Parse the q value from the querystring
	useEffect(() => {
		setQueryTermState(getQueryTerm(queryString));
	}, [queryString]);

	// Update the search term in the global nav search box
	// when the querystring changes (after browser navigation)
	useEffect(() => {
		const searchInput = document.querySelector(
			searchInputSelector
		) as HTMLInputElement | null;
		if (searchInput) searchInput.value = queryTerm;
	}, [queryTerm]);

	const allTopicsQueryData = useStaticQuery<AllTopicsQueryResults>(
		allTopicsQuery
	);

	// Memoize the topics for autocomplete so we don't re-compute on every render
	const autocompleteTerms = useMemo(
		() =>
			allTopicsQueryData.allCksTopic.nodes.map(({ topicName, slug }) => ({
				Title: topicName,
				Link: `/topics/${slug}/`,
			})),
		[allTopicsQueryData]
	);

	// TODO: Remove this hack to fix https://github.com/alphagov/accessible-autocomplete/issues/434
	// We do this to make our axe tests pass
	// Wait for the search box to appear before removing the aria-activedescendant attribute
	const globalNavWrapperRef = useCallback((node: HTMLDivElement) => {
		const removeActiveDescendantAttr = (): boolean => {
			const searchInput = document.querySelector(searchInputSelector);
			searchInput && searchInput.setAttribute("aria-activedescendant", "");
			return !!searchInput;
		};

		if (!removeActiveDescendantAttr() && "MutationObserver" in window) {
			new MutationObserver((_mutationsList, observer) => {
				removeActiveDescendantAttr();
				observer.disconnect();
			}).observe(node, { childList: true });
		}
	}, []);

	return (
		<>
			{typeof window !== "undefined" && (
				<Suspense fallback={<></>}>
					<div ref={globalNavWrapperRef}>
						<GlobalNavHeader
							service="cks"
							skipLinkId="content-start"
							onNavigating={(e): void => {
								if (e.href[0] === "/") navigate(e.href);
								else window.location.href = e.href;
							}}
							auth={false}
							search={{
								placeholder: "Search CKS…",
								autocomplete: autocompleteTerms,
								onSearching: (e): void => {
									navigate("/search?q=" + e.query);
								},
								query: queryTerm,
							}}
						/>
					</div>
				</Suspense>
			)}
		</>
	);
};
