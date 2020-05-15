import "@testing-library/jest-dom/extend-expect";
import { DataLayerEntry } from "types";

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
