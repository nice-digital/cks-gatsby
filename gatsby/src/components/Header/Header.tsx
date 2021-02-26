import React, { useEffect, useState, useCallback } from "react";
import { navigate } from "gatsby";
import { useLocation } from "@reach/router";
import { Header as GlobalNavHeader } from "@nice-digital/global-nav";

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

	// TODO: Remove this hack to fix https://github.com/alphagov/accessible-autocomplete/issues/434
	// We do this to make our axe tests pass
	// Wait for the search box to appear before removing the aria-activedescendant attribute
	const globalNavWrapperRef = useCallback((node: HTMLDivElement) => {
		let searchInput: HTMLElement | null;
		if ("MutationObserver" in window) {
			new MutationObserver(() => {
				searchInput =
					searchInput || document.querySelector(searchInputSelector);
				if (
					searchInput &&
					searchInput.getAttribute("aria-activedescendant") === "false"
				) {
					searchInput.setAttribute("aria-activedescendant", "");
				}
			}).observe(node, {
				attributeFilter: ["aria-activedescendant"],
				childList: true,
				subtree: true,
			});
		}
	}, []);

	return (
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
					autocomplete: "/api/autocomplete",
					onSearching: (e): void => {
						navigate("/search/?q=" + encodeURIComponent(e.query));
					},
					query: queryTerm,
				}}
			/>
		</div>
	);
};
