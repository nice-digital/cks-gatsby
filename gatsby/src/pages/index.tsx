import React from "react";
import { graphql, Link } from "gatsby";
import { PartialTopic } from "../types";

type IndexProps = {
	data: {
		allTopics: {
			nodes: PartialTopic[];
		};
	};
};

const IndexPage: React.FC<IndexProps> = ({
	data: { allTopics },
}: IndexProps) => {
	return (
		<div>
			<h1>CKS</h1>

			<h2>Topics</h2>
			<ul>
				{allTopics.nodes.map(({ id, topicName, slug }) => (
					<li key={id}>
						<Link to={`/${slug}`}>{topicName}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default IndexPage;

export const IndexPageQuery = graphql`
	{
		allTopics: allCksTopic {
			nodes {
				...PartialTopic
			}
		}
	}
`;
