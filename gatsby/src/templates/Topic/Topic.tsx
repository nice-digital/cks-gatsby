import React from "react";
import { graphql, PageRendererProps } from "gatsby";

import { Layout } from "../../components/Layout/Layout";
import { Topic } from "../../types";
import { SEO } from "../../components/SEO/SEO";

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
		<Layout>
			<SEO title={topicName + " | Topics A-Z"} description={topicSummary} />
			<h1>Topic: {topicName}</h1>
			<p>{topicSummary}</p>
		</Layout>
	);
};

export default TopicPage;

export const TopicPageQuery = graphql`
	query TopicById($id: String!) {
		topic: cksTopic(id: { eq: $id }) {
			...FullTopic
		}
	}
`;
