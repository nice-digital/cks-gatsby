const router = jest.requireActual("@reach/router");

// Mocking the useLocation hook allows it to be used anywhere, even if the component isn't rendered within a LocationProvider
const useLocation = jest.fn(
	() => new URL("https://cks-gatsby-tests.nice.org.uk/test/")
);

module.exports = {
	...router,
	useLocation,
};
