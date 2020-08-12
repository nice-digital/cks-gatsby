module.exports = {
	moduleNameMapper: {
		"\\.(css|scss)$": "identity-obj-proxy",
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
			"<rootDir>/__mocks__/fileMock.js",
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
	testURL: "https://cks-gatsby-tests.nice.org.uk/",
};
