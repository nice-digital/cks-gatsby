import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";
import { Topic } from "../types";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

type TopicPageProps = {
	data: {
		allTopics: {
			nodes: Topic[];
		};
	};
} & PageRendererProps;

const TopicsPage: React.FC<TopicPageProps> = ({ data }: TopicPageProps) => (
	<Layout>
		<SEO title={"Topics"} />
		<h1>Topics</h1>
		<ul>
			{data.allTopics.nodes.map(({ id, slug, topicName }) => (
				<li key={id}>
					<Link to={slug}>{topicName}</Link>
				</li>
			))}
		</ul>
	</Layout>
);

export const query = graphql`
	{
		allTopics: allCksTopic {
			nodes {
				...PartialTopic
			}
		}
	}
`;

export default TopicsPage;
