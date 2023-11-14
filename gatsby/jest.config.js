module.exports = {
	prettierPath: require.resolve("prettier-2"),
	moduleNameMapper: {
		"\\.(css|scss)$": "identity-obj-proxy",
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
			"<rootDir>/__mocks__/fileMock.js",
		// See https://www.gatsbyjs.com/docs/reference/release-notes/migrating-from-v2-to-v3/#reach-router
		"^@reach/router(.*)": "<rootDir>/node_modules/@gatsbyjs/reach-router$1",
		// Jest is complaining about ESM modules, so we'll use the CJS equivalents instead
		"@mantine/hooks/esm/use-focus-trap/use-focus-trap":
			"@mantine/hooks/cjs/use-focus-trap/use-focus-trap",
		"@mantine/hooks/esm/use-debounced-value/use-debounced-value":
			"@mantine/hooks/cjs/use-debounced-value/use-debounced-value",
	},
	preset: "ts-jest",
	collectCoverage: process.env.TEAMCITY_VERSION ? true : false,
	collectCoverageFrom: [
		"src/**/*.{js,jsx,ts,tsx}",
		"!**/node_modules/**",
		"!src/graphql-fragments/**",
	],
	testResultsProcessor: "jest-teamcity-reporter",
	moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
	moduleDirectories: ["node_modules", "utils", __dirname],
	testPathIgnorePatterns: ["/node_modules/", ".cache"],
	setupFilesAfterEnv: ["./jest.setup.ts"],
	testEnvironment: "jsdom",
	testEnvironmentOptions: {
		url: "https://cks-gatsby-tests.nice.org.uk/",
	},
};
