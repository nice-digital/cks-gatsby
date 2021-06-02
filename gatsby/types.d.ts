import { AutoCompleteOptions } from "@nice-digital/global-nav";
export {};

// Mock window.dataLayer, part of GTM. Global nav header relies on this
export type DataLayerEntry = {
	location?: string;
	event?: string;
	eventCallback?: () => void;
	eventTimeout?: number;
	eventValue?: number;
	[key: string]: unknown;
};

declare global {
	interface Window {
		dataLayer: Array<DataLayerEntry>;
		autocompleteSuggestionTemplate?: AutoCompleteOptions["suggestionTemplate"];
	}
}
