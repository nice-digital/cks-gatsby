/* eslint-disable @typescript-eslint/no-unused-vars */
// See https://www.gatsbyjs.org/docs/unit-testing/#mocking-gatsby
const React = require("react");
const gatsby = jest.requireActual("gatsby");

const navigate = jest.fn();

module.exports = {
	...gatsby,
	navigate: navigate,
	graphql: jest.fn(),
	Link: jest.fn().mockImplementation(
		// these props are invalid for an `a` tag
		({
			activeClassName,
			activeStyle,
			getProps,
			innerRef,
			partiallyActive,
			ref,
			replace,
			to,
			onClick,
			...rest
		}) =>
			React.createElement("a", {
				...rest,
				href: to,
				onClick: e => {
					// Call the navigate mock function, so tests can asserts on calls to the mock
					navigate(to);
					onClick && onClick(e);
				},
			})
	),
	StaticQuery: jest.fn(),
	useStaticQuery: jest.fn(),
};
