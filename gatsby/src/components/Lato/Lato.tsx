import React, { SyntheticEvent } from "react";
import { Helmet } from "react-helmet";

const cssHref =
	"https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=fallback";

/**
 * Loads Lato from Google fonts asynchronously as per https://csswizardry.com/2020/05/the-fastest-google-fonts/
 */
export const Lato: React.FC = () => (
	<Helmet>
		{/* 1. Preemptively warm up the fonts’ origin */}
		<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossOrigin="crossOrigin"
		/>
		{/* 2. Initiate a high-priority, asynchronous fetch for the CSS file.
		Works in most modern browsers. */}
		<link rel="preload" as="style" href={cssHref} />
		{/* 2. Initiate a low-priority, asynchronous fetch that gets applied to the
		page only after it’s arrived. Works in all browsers with JavaScript enabled. */}
		<link
			rel="stylesheet"
			href={cssHref}
			media="print"
			onLoad={
				/* This double cast hack is because of this PR not being merged: https://github.com/nfl/react-helmet/pull/299 */
				("this.media='all'" as unknown) as (
					event: SyntheticEvent<HTMLLinkElement, Event>
				) => void
			}
		/>
		{/* In the unlikely event that a visitor has intentionally disabled
		JavaScript, fall back to the original method. The good news is that,
		although this is a render-blocking request, it can still make use of the
		preconnect which makes it marginally faster than the default. */}
		<noscript>{`<link rel="stylesheet" href="${cssHref}" />`}</noscript>
	</Helmet>
);
