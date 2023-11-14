import { enableFetchMocks } from "jest-fetch-mock";
import { DataLayerEntry } from "types";
import "@testing-library/jest-dom";

// Enable mock fetch, mostly for the autocomplete requests from the header
enableFetchMocks();

// Header uses useStaticQuery in it, so easier to mock it globally as a no-op
jest.mock("./src/components/SiteHeader/SiteHeader", () => {
	return {
		SiteHeader: (): null => null,
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
