export interface PartialTopic {
	/** The Gatsby id and NOT the API id */
	id: string;
	/** API id of the topic */
	topicId: string;
	/** Name of the topic eg. Achilles tendinopathy */
	topicName: string;
	/** Path slug, for use within a URL */
	slug: string;
}

export interface PartialTopicWithChapters extends PartialTopic {
	lastRevised: string;
	chapters: PartialChapter[];
}

export interface Topic extends PartialTopicWithChapters {
	/** Intro sentence (or two) describing the topic */
	topicSummary: string;
	nextPlannedReviewByDateTime: string;
	nextPlannedReviewByDisplay: string;
	specialities: PartialSpeciality[];
}

export interface PartialSpeciality {
	id: string;
	name: string;
	slug: string;
}

export interface Speciality extends PartialSpeciality {
	topics: PartialTopic[];
}

export interface WhatsNewChange {
	id: string;
	title: string;
	text: string;
	topic: PartialTopic;
}

/**
 * For use in lists
 */
interface PartialChapter {
	/** The Gatsby id and NOT the API itemId field */
	id: string;
	/** Path slug, for use within a URL */
	slug: string;
	/** Chapter name e.g. Summary */
	fullItemName: string;
	subChapters: PartialChapter[];
}

export interface ChapterLevel1 extends PartialChapter {
	depth: number;
	htmlHeader: string;
	htmlStringContent: string;
	topic: PartialTopicWithChapters;
}

export interface ChapterLevel2 extends PartialChapter {
	depth: number;
	htmlHeader: string;
	htmlStringContent: string;
	topic: PartialTopicWithChapters;
	subChapters: ChapterLevel2[];
	parentChapter: PartialChapter;
}
