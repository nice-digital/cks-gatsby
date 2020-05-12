import "@testing-library/jest-dom/extend-expect";

// Mock window.dataLayer, part of GTM. Global nav header relies on this
type DataLayerEntry = {
	event: string;
	eventCallback?: () => void;
	eventTimeout?: number;
} & { [key: string]: string };

declare global {
	interface Window {
		dataLayer: Array<DataLayerEntry>;
	}
}

const dataLayerPush = jest
	.fn<number, DataLayerEntry[]>()
	.mockImplementation(({ eventCallback }: DataLayerEntry): number => {
		if (eventCallback) eventCallback();
		return 0;
	});

const dataLayer: DataLayerEntry[] = [];
dataLayer.push = dataLayerPush;
window.dataLayer = dataLayer;

afterEach(() => {
	dataLayerPush.mockClear();
});
