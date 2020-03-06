import { graphql } from "gatsby";

export const FullTopic = graphql`
	fragment FullTopic on CksTopic {
		...PartialTopic
		topicSummary
	}
`;
