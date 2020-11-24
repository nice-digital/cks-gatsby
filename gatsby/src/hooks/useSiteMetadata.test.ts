import { useSiteMetadata } from "./useSiteMetadata";
import { useStaticQuery, graphql } from "gatsby";

const useStaticQueryMock = useStaticQuery as jest.Mock;
const graphqlMock = graphql as jest.Mock;

describe("useSiteMetadata", () => {
	beforeEach(() => {
		useStaticQueryMock.mockReturnValue({
			site: {
				siteMetadata: {
					test: true,
				},
			},
		});
	});

	it("should match snapshot for site query", async () => {
		useSiteMetadata();

		expect(graphqlMock).toHaveBeenCalledTimes(1);
		expect(graphqlMock.mock.calls[0][0][0]).toMatchInlineSnapshot(`
		"
					query SiteMetaData {
						site {
							siteMetadata {
								title
								siteUrl
								changesSinceDateISO: changesSinceDate(formatString: \\"YYYY-MM\\")
								changesSinceDateFormatted: changesSinceDate(
									formatString: \\"MMMM YYYY\\"
								)
							}
						}
					}
				"
	`);
	});

	it("should return site metadata", () => {
		expect(useSiteMetadata()).toEqual({ test: true });
	});
});
