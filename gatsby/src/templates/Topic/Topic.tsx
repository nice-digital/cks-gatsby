import React from "react";
import { graphql, PageProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Layout } from "../../components/Layout/Layout";
import { SEO } from "../../components/SEO/SEO";
import { ChapterContents } from "../../components/ChapterContents/ChapterContents";
import { ChapterBody } from "../../components/ChapterBody/ChapterBody";

import { Topic, ChapterLevel1 } from "../../types";

export type TopicPageProps = PageProps<
	{
		firstChapter: ChapterLevel1;
		topic: Topic;
	},
	{
		id: string;
	}
>;

const TopicPage: React.FC<TopicPageProps> = ({
	data: { topic, firstChapter },
}: TopicPageProps) => {
	const { topicName, topicSummary, lastRevised } = topic;

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

			<PageHeader heading={topicName} lead={lastRevised} />

			<p className="visually-hidden">{topicSummary}</p>

			<ChapterContents chapter={firstChapter}>
				<ChapterBody chapter={firstChapter} />
			</ChapterContents>
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
			id
			slug
			fullItemName
			depth
			htmlHeader
			htmlStringContent
			topic {
				...PartialTopic
				chapters {
					...PartialChapter
				}
			}
		}
		topic: cksTopic(id: { eq: $id }) {
			...FullTopic
		}
	}
`;
