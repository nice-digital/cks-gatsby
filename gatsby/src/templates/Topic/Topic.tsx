import React, { useMemo } from "react";
import { graphql, PageProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Layout } from "../../components/Layout/Layout";
import { SEO } from "../../components/SEO/SEO";
import { ChapterContents } from "../../components/ChapterContents/ChapterContents";
import { ChapterBody } from "../../components/ChapterBody/ChapterBody";
import { ColumnList } from "../../components/ColumnList/ColumnList";

import { Topic, ChapterLevel1, PartialChapter } from "../../types";

import styles from "./Topic.module.scss";

export type TopicPageProps = PageProps<
	{
		firstChapter: ChapterLevel1;
		topic: Topic;
	},
	{
		id: string;
	}
>;

const LandingChapterHeadings = [
	"Diagnosis",
	"Management",
	"Prescribing information",
	"Background information",
];

const isLandingLink = (c: PartialChapter) =>
	LandingChapterHeadings.indexOf(c.fullItemName) > -1;

const landingLinkComparer = (a: PartialChapter, b: PartialChapter) =>
	LandingChapterHeadings.indexOf(a.fullItemName) -
	LandingChapterHeadings.indexOf(b.fullItemName);

const TopicPage: React.FC<TopicPageProps> = ({
	data: { topic, firstChapter },
}: TopicPageProps) => {
	const { topicName, topicSummary, lastRevised, chapters } = topic;

	const landingLinks = useMemo(
		() => chapters.filter(isLandingLink).sort(landingLinkComparer),
		[chapters]
	);

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

			<PageHeader
				heading={topicName}
				lead={<span dangerouslySetInnerHTML={{ __html: lastRevised }} />}
			/>

			<p className="visually-hidden">{topicSummary}</p>

			<ChapterContents chapter={firstChapter}>
				{landingLinks.map((chapter, i) => (
					<section
						key={chapter.id}
						aria-labelledby={chapter.slug}
						className={[
							styles.landingSection,
							i == landingLinks.length - 1 ? styles.lastLandingSection : "",
						].join(" ")}
					>
						<h2 id={chapter.slug} className={styles.landingHeading}>
							{chapter.fullItemName}
						</h2>
						<ColumnList
							plain
							columns={3}
							aria-label={`${chapter.fullItemName} chapters`}
						>
							{chapter.subChapters.map((subChapter) => (
								<li key={subChapter.id}>
									<Link
										to={`/topics/${topic.slug}/${chapter.slug}/${subChapter.slug}/`}
										data-tracking="landing-link"
									>
										{subChapter.fullItemName}
									</Link>
								</li>
							))}
						</ColumnList>
					</section>
				))}
				<ChapterBody chapter={firstChapter} showHeading={true} />
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
			...PartialChapter
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
