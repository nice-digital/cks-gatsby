module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	plugins: ["react", "@typescript-eslint", "prettier", "testing-library"],
	extends: [
		"plugin:react/recommended",
		"plugin:prettier/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:testing-library/react",
	],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: "module",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-explicit-any": 2,
	},
	overrides: [
		{
			files: ["*.js"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
				"@typescript-eslint/no-var-requires": "off",
				"@typescript-eslint/explicit-module-boundary-types": "off",
			},
		},
		{
			files: ["**/*.tsx"],
			rules: {
				"react/prop-types": "off",
			},
		},
	],
};
