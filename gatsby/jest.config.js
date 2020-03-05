module.exports = {
	moduleNameMapper: {
		"\\.(css|scss)$": "identity-obj-proxy",
	},
	preset: "ts-jest",
	collectCoverage: process.env.TEAMCITY_VERSION ? true : false,
	collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!**/node_modules/**"],
	testResultsProcessor: "jest-teamcity-reporter",
	moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
	testPathIgnorePatterns: ["/node_modules/", ".cache"],
	setupFilesAfterEnv: ["./jest.setup.ts"],
	testURL: "https://cks-gatsby-tests.nice.org.uk/",
};
