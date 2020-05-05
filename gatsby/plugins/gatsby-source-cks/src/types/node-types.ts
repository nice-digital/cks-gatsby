import { NodeInput } from "gatsby";
import {
	topicNodeType,
	specialityNodeType,
	changeNodeType,
	chapterNodeType,
} from "../node-types";

// Gatsby nodes

export interface TopicNode extends NodeInput {
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
	internal: {
		type: typeof topicNodeType;
	} & NodeInput["internal"];
}

export interface SpecialityNode extends NodeInput {
	name: string;
	slug: string;
	// Foreign keys
	topics: string[];
	internal: {
		type: typeof specialityNodeType;
	} & NodeInput["internal"];
}

export interface ChapterNode extends NodeInput {
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
	internal: {
		type: typeof chapterNodeType;
	} & NodeInput["internal"];
}

export interface ChangeNode extends NodeInput {
	title: string;
	text: string;
	// Foreign keys
	topic: string;
	internal: {
		type: typeof changeNodeType;
	} & NodeInput["internal"];
}
