import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Layout } from "../../components/Layout/Layout";
import { TopicChaptersMenu } from "../../components/TopicChaptersMenu/TopicChaptersMenu";
import { SEO } from "../../components/SEO/SEO";

import { Topic, Chapter } from "../../types";

type TopicPageProps = {
	data: {
		firstChapter: Chapter;
		topic: Topic;
	};
} & PageRendererProps;

const TopicPage: React.FC<TopicPageProps> = ({
	data: { firstChapter, topic },
}: TopicPageProps) => {
	const { topicName, topicSummary } = topic;

	return (
		<Layout>
			<SEO title={topicName + " | Topics A to Z"} description={topicSummary} />
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb to="/topics/" elementType={Link}>
					Topics A to Z
				</Breadcrumb>
				<Breadcrumb>{topicName}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader heading={topicName} lead={topicSummary} />

			<Grid gutter="loose">
				<GridItem cols={12} sm={4} md={3}>
					<TopicChaptersMenu topic={topic} chapterId={firstChapter.id} />
				</GridItem>
				<GridItem cols={12} sm={8} md={9}>
					<h2 className="mt--0">{firstChapter.fullItemName}</h2>
					<div
						dangerouslySetInnerHTML={{ __html: firstChapter.htmlStringContent }}
					/>
				</GridItem>
			</Grid>
		</Layout>
	);
};

export default TopicPage;

export const TopicPageQuery = graphql`
	query TopicById($id: String!) {
		firstChapter: cksChapter(
			topic: { id: { eq: $id } }
			depth: { eq: 1 }
			pos: { eq: 0 }
		) {
			...FullChapter
		}
		topic: cksTopic(id: { eq: $id }) {
			...FullTopic
		}
	}
`;
