import React from "react";
import { graphql, PageProps, Link } from "gatsby";

import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Card } from "@nice-digital/nds-card";

import { Layout } from "../../components/Layout/Layout";
import { Chapter } from "../../types";
import { SEO } from "../../components/SEO/SEO";
import { TopicChaptersMenu } from "../../components/TopicChaptersMenu/TopicChaptersMenu";

import styles from "./Chapter.module.scss";

type ChapterPageProps = {
	data: {
		chapter: Chapter;
	};
} & PageProps;

const stripHtmlComments = (html: string): string =>
	html.replace(/<!--[\s\S]*?(?:-->)/g, "");

const ChapterPage: React.FC<ChapterPageProps> = ({
	data: {
		chapter: {
			id: chapterId,
			slug,
			fullItemName,
			htmlHeader,
			htmlStringContent,
			topic,
			parentChapter,
			subChapters,
		},
	},
}: ChapterPageProps) => {
	const topicPath = `/topics/${topic.slug}/`;

	return (
		<Layout>
			<SEO
				title={`${fullItemName}${
					parentChapter ? ` | ${parentChapter.fullItemName}` : ""
				} | ${topic.topicName}`}
				description={""}
			/>

			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">Home</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb to="/topics/" elementType={Link}>
					Topics A to Z
				</Breadcrumb>
				<Breadcrumb to={topicPath} elementType={Link}>
					{topic.topicName}
				</Breadcrumb>
				{parentChapter ? (
					<Breadcrumb
						to={`${topicPath}${parentChapter.slug}/`}
						elementType={Link}
					>
						{parentChapter.fullItemName}
					</Breadcrumb>
				) : (
					<></>
				)}
				<Breadcrumb>{fullItemName}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader heading={fullItemName} preheading={`${topic.topicName}: `} />

			<Grid gutter="loose">
				<GridItem cols={12} sm={4} md={3}>
					<TopicChaptersMenu chapterId={chapterId} topic={topic} />
				</GridItem>
				<GridItem cols={12} sm={8} md={6}>
					{!parentChapter && stripHtmlComments(htmlStringContent) === "" ? (
						<ul className="list--unstyled">
							{subChapters.map(subChapter => (
								<li key={subChapter.id}>
									<Card
										headingText={subChapter.fullItemName}
										link={{
											elementType: Link,
											destination: `/topics/${topic.slug}/${slug}/${subChapter.slug}/`,
										}}
									></Card>
								</li>
							))}
						</ul>
					) : (
						<>
							<div
								className={styles.body}
								dangerouslySetInnerHTML={{
									__html: htmlHeader + htmlStringContent,
								}}
							></div>

							{parentChapter &&
								subChapters.map(subChapter => (
									<div key={subChapter.id}>
										<>
											<div
												dangerouslySetInnerHTML={{
													__html:
														subChapter.htmlHeader +
														subChapter.htmlStringContent,
												}}
											></div>
											{subChapter.subChapters.map(subChapter => (
												<div key={subChapter.id}>
													<>
														<div
															dangerouslySetInnerHTML={{
																__html:
																	subChapter.htmlHeader +
																	subChapter.htmlStringContent,
															}}
														></div>
													</>
												</div>
											))}
										</>
									</div>
								))}
						</>
					)}
				</GridItem>
				<GridItem cols={12} sm={12} md={3} elementType="aside">
					<h2 className="mt--0">On this page</h2>
					<p>TODO</p>
				</GridItem>
			</Grid>
		</Layout>
	);
};

export default ChapterPage;

export const ChapterPageQuery = graphql`
	query ChapterById($id: String!) {
		chapter: cksChapter(id: { eq: $id }) {
			...FullChapter
		}
	}
`;
