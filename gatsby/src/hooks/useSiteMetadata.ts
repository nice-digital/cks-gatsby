import { useStaticQuery, graphql } from "gatsby";

interface SiteMetaData {
	siteUrl: string;
	title: string;
	changesSinceDateISO: string;
	changesSinceDateFormatted: string;
}

interface Site {
	site: {
		siteMetadata: SiteMetaData;
	};
}

export const useSiteMetadata = (): SiteMetaData => {
	const { site } = useStaticQuery<Site>(graphql`
		query SiteMetaData {
			site {
				siteMetadata {
					title
					siteUrl
					changesSinceDateISO: changesSinceDate(formatString: "YYYY-MM")
					changesSinceDateFormatted: changesSinceDate(formatString: "MMMM YYYY")
				}
			}
		}
	`);
	return site.siteMetadata;
};
