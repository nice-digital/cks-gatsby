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

export interface Topic extends PartialTopic {
	/** Intro sentence (or two) describing the topic */
	topicSummary: string;
}

export interface Speciality {
	id: string;
	name: string;
	slug: string;
	// Foreign keys
	topics: string[];
}
