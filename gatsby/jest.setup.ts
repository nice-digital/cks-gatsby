import "@testing-library/jest-dom/extend-expect";
import { DataLayerEntry } from "types";

// Header uses useStaticQuery in it, so easier to mock it globally as a no-op
jest.mock("./src/components/Header/Header", () => {
	return {
		Header: (): null => null,
	};
});
// No need to have the footer rendered for each component
jest.mock("./src/components/Footer/Footer", () => {
	return {
		Footer: (): null => null,
	};
});

// Mock the useSiteMetadata hook as it uses useStaticQuery under the hood, which itself mocked!
jest.mock("./src/hooks/useSiteMetadata", () => {
	return {
		useSiteMetadata: (): unknown => ({
			siteUrl: "https://cks.nice.org.uk",
		}),
	};
});

// Mock the useLocation hook as it can be used anywhere
jest.mock("@reach/router", () => {
	return {
		...(jest.requireActual("@reach/router") as Record<string, unknown>),
		useLocation: () => ({
			pathname: "/test/",
		}),
	};
});

window.dataLayer = [];
const originalPush = window.dataLayer.push;

window.dataLayer.push = jest.fn<number, DataLayerEntry[]>(
	(dataLayerEntry: DataLayerEntry): number => {
		// Mimick the eventCallback function being called as it would do in a browser
		// with GTM loaded.
		if (dataLayerEntry.eventCallback)
			setTimeout(dataLayerEntry.eventCallback, 100);
		return originalPush.call(window.dataLayer, dataLayerEntry);
	}
);

afterEach(() => {
	(window.dataLayer.push as jest.Mock).mockClear();
});
