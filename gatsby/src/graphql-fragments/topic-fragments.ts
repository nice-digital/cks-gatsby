import { graphql } from "gatsby";

export const PartialTopic = graphql`
	fragment PartialTopic on CksTopic {
		id
		topicId
		topicName
		slug
	}
`;

export const FullTopic = graphql`
	fragment FullTopic on CksTopic {
		...PartialTopic
		topicSummary
		lastRevised
		nextPlannedReviewBy
		nextPlannedReviewByDateTime: nextPlannedReviewBy(formatString: "YYYY-MM")
		nextPlannedReviewByDisplay: nextPlannedReviewBy(formatString: "MMMM YYYY")
		specialities {
			id
			name
			slug
		}
		chapters {
			...PartialChapter
		}
	}
`;
