import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";

import { Panel } from "@nice-digital/nds-panel";
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
	const {
		slug: topicSlug,
		topicName,
		topicSummary,
		chapters,
		specialities,
		lastRevised,
		nextPlannedReviewByDateTime,
		nextPlannedReviewByDisplay,
	} = topic;

	return (
		<Layout>
			<SEO title={topicName + " | Topics A to Z"} description={topicSummary} />
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">Home</Breadcrumb>
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
				<GridItem cols={12} sm={8} md={6}>
					<h2 className="mt--0">{firstChapter.fullItemName}</h2>
					<div
						dangerouslySetInnerHTML={{ __html: firstChapter.htmlStringContent }}
					/>
				</GridItem>
				<GridItem cols={12} sm={12} md={3} elementType="aside">
					{specialities.length > 0 && (
						<Panel>
							<h2 className="h4">Related specialities</h2>
							<ul className="list--unstyled">
								{specialities.map(({ id, slug, name }) => (
									<li key={id}>
										<Link to={`/specialities/${slug}/`}>{name}</Link>
									</li>
								))}
							</ul>
						</Panel>
					)}
					<Panel>
						<h2 className="h4">Review schedule</h2>
						<p>{lastRevised}.</p>
						<p>
							Next planned review date is{" "}
							<strong>
								<time dateTime={nextPlannedReviewByDateTime}>
									{nextPlannedReviewByDisplay}
								</time>
								.
							</strong>
						</p>
					</Panel>
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
