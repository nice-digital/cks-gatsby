import { NodeInput } from "gatsby";
import {
	topicNodeType,
	specialityNodeType,
	changeNodeType,
	chapterNodeType,
} from "./node-types";

// Gatsby nodes

export type TopicNode = {
	topicName: string;
	slug: string;
	topicId: string;
	nextPlannedReviewBy: string | null; // Must be an ISO date format
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
} & NodeInput & {
		internal: {
			type: typeof topicNodeType;
		};
	};

export type SpecialityNode = {
	name: string;
	slug: string;
	// Foreign keys
	topics: string[];
} & NodeInput & {
		internal: {
			type: typeof specialityNodeType;
		};
	};

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
	parentChapter: string | null;
	rootChapter: string;
	subChapters: string[];
} & NodeInput & {
		internal: {
			type: typeof chapterNodeType;
		};
	};

export type ChangeNode = {
	title: string;
	text: string;
	// Foreign keys
	topic: string;
} & NodeInput & {
		internal: {
			type: typeof changeNodeType;
		};
	};
