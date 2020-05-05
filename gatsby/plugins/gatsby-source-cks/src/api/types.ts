// API requests

import { ConfigOptions } from "../types";

export type ApiConfig = Pick<ConfigOptions, "apiBaseUrl" | "apiKey">;

// API responses

export interface ApiPartialTopic {
	id: string;
	name: string;
	currentPublishDate: Date; // E.g. "2019-08-23T12:53:50.6829817+01:00" from API
	currentVersion: number;
	currentVersionLink: string;
	previousVersionLinks: string[];
}

export interface ApiTopicsResponse {
	topicCount: number;
	baseUrl: string;
	topics: ApiPartialTopic[];
}

interface ApiTopicHtmlObject {
	itemId: string;
	parentId: string | null;
	rootId: string;
	fullItemName: string;
	htmlHeader: string;
	htmlStringContent: string;
	containerElement: string;
	children: ApiTopicHtmlObject[];
	depth: number;
	pos: number;
}

/**
 * A full topic object returned from the API
 */
export interface ApiFullTopicResponse extends ApiPartialTopic {
	/** Name of the topic e.g. "Acne Vulgaris" */
	topicName: string;
	/** Guid */
	topicId: string;
	/** Guid */
	exportId: string;
	/** Guid */
	dataId: string;
	/** The revision number */
	number: number;
	dateOfExport: string; // E.g. "2019-07-10T11:51:10.5139841+00:00"
	nextPlannedReviewBy: string | null; // E.g. "2023-12-31T23:59:59+00:00"
	topicSummary: string;
	lastRevised: string; // E.g. "Last revised in April 2018"
	terms: {
		code: string;
		term: string;
	}[];
	/**
	 * Specialities grouping topics together e.g. "Skin and nail" etc.
	 * The spelling mistake is present in the API.
	 */
	clinicalSpecialties: string[];
	topicHtmlObjects: ApiTopicHtmlObject[];
	latestChanges: {
		dateFrom: string;
		dateTo: string;
		title: string;
		body: string;
	}[];
}

export interface TopicChange {
	topicId: string;
	topicName: string;
	title: string;
	text: string;
}

export type ApiTopicChangeResponse = TopicChange[];
