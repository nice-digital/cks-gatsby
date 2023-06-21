import { useStaticQuery, graphql } from "gatsby";

// We mock this hook globally as it's used within every page
// So we have to get the _actual_ implementation to be able to test it
const useSiteMetadata = jest.requireActual("./useSiteMetadata").useSiteMetadata;

// These gatsby fucntions are mocked globally in our test setup
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
								changesSinceDateISO: changesSinceDate(formatString: "YYYY-MM")
								changesSinceDateFormatted: changesSinceDate(
									formatString: "MMMM YYYY"
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
