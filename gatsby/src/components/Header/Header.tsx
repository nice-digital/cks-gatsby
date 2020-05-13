import React, { useEffect, Suspense, lazy, useState } from "react";
import { navigate } from "gatsby";
import { useLocation } from "@reach/router";

// Use lazy in tandem with Suspense to load Global Nav *only* on the client side.
// As per https://www.gatsbyjs.org/docs/using-client-side-only-packages/#workaround-4-use-reactlazy-and-suspense-on-client-side-only
// Because we're waiting on an upstream release in alphagov/accessible-autocomplete to fix https://github.com/alphagov/accessible-autocomplete/issues/352
// See: https://github.com/alphagov/accessible-autocomplete/milestone/6 and https://github.com/alphagov/accessible-autocomplete/issues/433
const GlobalNavHeader = lazy(() => import("./GlobalNavHeader"));

const getQuery = (locationSerch: string): string => {
	const queryMatch = locationSerch.match(/q=([^&]*)/);
	return queryMatch
		? decodeURIComponent(queryMatch[1].replace(/\+/g, "%20"))
		: "";
};

export const Header: React.FC = () => {
	const location = useLocation();

	const [query, setQuery] = useState(getQuery(location.search));

	// Update the search term in the global nav search box
	// when the querystring changes (after browser navigation)
	useEffect(() => {
		setQuery(getQuery(location.search));

		const searchInput = document.querySelector(
			"header form[role='search'] [name='q']"
		);

		if (searchInput) (searchInput as HTMLInputElement).value = query;
	}, [location]);

	return (
		<>
			{typeof window !== "undefined" && (
				<Suspense fallback={<></>}>
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
							onSearching: (e): void => {
								navigate("/search?q=" + e.query);
							},
							query,
						}}
					/>
				</Suspense>
			)}
		</>
	);
};
