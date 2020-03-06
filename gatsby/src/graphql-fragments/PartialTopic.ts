import { graphql } from "gatsby";

export const PartialTopic = graphql`
	fragment PartialTopic on CksTopic {
		id
		topicId
		topicName
		slug
	}
`;
