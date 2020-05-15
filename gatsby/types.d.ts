export {};

// Mock window.dataLayer, part of GTM. Global nav header relies on this
export type DataLayerEntry = {
	event: string;
	eventCallback?: () => void;
	eventTimeout?: number;
} & { [key: string]: string };

declare global {
	interface Window {
		dataLayer: Array<DataLayerEntry>;
	}
}
