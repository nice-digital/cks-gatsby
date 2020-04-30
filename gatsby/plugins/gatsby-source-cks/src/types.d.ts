import { NodeInput } from "gatsby";

// Gatsby nodes

export type TopicNode = {
	topicName: string;
	slug: string;
	topicId: string;
	nextPlannedReviewBy?: string; // Must be an ISO date format
	topicSummary: string;
	lastRevised: string;
	terms: {
		code: string;
		term: string;
	}[];
	// Foreign keys
	specialities: string[];
	chapters: string[];
	latestChanges: string[];
} & NodeInput;

export type SpecialityNode = {
	name: string;
	slug: string;
	// Foreign keys
	topics: string[];
} & NodeInput;

export type ChapterNode = {
	slug: string;
	itemId: string;
	fullItemName: string;
	htmlHeader: string;
	htmlStringContent: string;
	containerElement: string;
	depth: number;
	pos: number;
	// Foreign keys
	topic: string;
	parentChapter?: string;
	rootChapter: string;
	subChapters: string[];
} & NodeInput;

export type ChangeNode = {
	title: string;
	text: string;
	// Foreign keys
	topic: string;
} & NodeInput;
