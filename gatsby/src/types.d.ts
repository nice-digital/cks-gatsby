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
	chapters: PartialChapter[];
}

export interface Topic extends PartialTopicWithChapters {
	/** Intro sentence (or two) describing the topic */
	topicSummary: string;
	nextPlannedReviewByDateTime: string;
	nextPlannedReviewByDisplay: string;
	lastRevised: string;
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

interface BasePartialChapter {
	/** The Gatsby id and NOT the API itemId field */
	id: string;
	/** Path slug, for use within a URL */
	slug: string;
	/** Chapter name e.g. Summary */
	fullItemName: string;
}

interface PartialChapterWithContent extends BasePartialChapter {
	subChapters: PartialChapterWithContent[];
	/** The HTML body of the chapter */
	htmlStringContent: string;
	htmlHeader: string;
}

interface PartialChapter extends BasePartialChapter {
	subChapters: BasePartialChapter[];
	parentChapter?: BasePartialChapter;
}

export interface Chapter extends PartialChapter, PartialChapterWithContent {
	topic: PartialTopicWithChapters;
	subChapters: PartialChapterWithContent[];
}
