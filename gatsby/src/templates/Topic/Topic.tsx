import React from "react";
import { graphql, PageRendererProps } from "gatsby";
import { Topic } from "../../types";

type TopicPageProps = {
	data: {
		topic: Topic;
	};
} & PageRendererProps;

const TopicPage: React.FC<TopicPageProps> = ({
	data: {
		topic: { topicName, topicSummary },
	},
}: TopicPageProps) => {
	return (
		<div>
			<h1>Topic: {topicName}</h1>
			<p>{topicSummary}</p>
		</div>
	);
};

export default TopicPage;

export const TopicxPageQuery = graphql`
	query TopicById($id: String!) {
		topic: cksTopic(id: { eq: $id }) {
			...FullTopic
		}
	}
`;
