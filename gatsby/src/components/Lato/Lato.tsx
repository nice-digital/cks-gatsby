import React from "react";
import { Helmet } from "react-helmet";

const cssHref =
	"https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap";

/**
 * Loads Lato from Google fonts asynchronously as per https://csswizardry.com/2020/05/the-fastest-google-fonts/
 */
export const Lato: React.FC = () => (
	<Helmet>
		<link
			rel="preconnect"
			href="https://fonts.gstatic.com"
			crossOrigin="crossOrigin"
		/>
		<link rel="preload" as="style" href={cssHref} />
		{/* We have to use a script tag to load the CSS because https://github.com/nfl/react-helmet/pull/299 isn't released */}
		<script>
			{[
				`(function(d){`,
				`var l=d.createElement("link");`,
				`l.href="${cssHref}";`,
				`l.rel="stylesheet";`,
				`l.media="print";`,
				`l.onload=function(){this.media="all"};`,
				`d.getElementsByTagName("head")[0].appendChild(l);`,
				`})(document);`,
			].join("")}
		</script>
		<noscript>{`<link rel="stylesheet" href="${cssHref}" />`}</noscript>
	</Helmet>
);
