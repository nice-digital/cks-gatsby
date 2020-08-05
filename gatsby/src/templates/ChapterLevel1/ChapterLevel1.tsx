import React, { useMemo } from "react";
import { PageProps, Link } from "gatsby";

import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ChapterLevel1 } from "../../types";
import { Layout } from "../../components/Layout/Layout";
import { SEO } from "../../components/SEO/SEO";
import { ChapterContents } from "../../components/ChapterContents/ChapterContents";
import { stripHtmlTags, stripHtmlComments } from "../../utils/html-utils";

import styles from "./ChapterLevel1.module.scss";

interface ChapterPageContext {
	chapter: ChapterLevel1;
}

export type ChapterLevel1PageProps = PageProps<null, ChapterPageContext>;

const ChapterLevel1Page: React.FC<ChapterLevel1PageProps> = ({
	pageContext: { chapter },
}: ChapterLevel1PageProps) => {
	const {
		slug,
		fullItemName,
		htmlHeader,
		htmlStringContent,
		topic,
		subChapters,
	} = chapter;

	const topicPath = `/topics/${topic.slug}/`;

	const headerNoHtml = useMemo(() => stripHtmlTags(htmlHeader), [htmlHeader]);

	const htmlStringContentNoComments = useMemo(
		() => stripHtmlComments(htmlStringContent),
		[htmlStringContent]
	);

	return (
		<Layout>
			<SEO
				title={`${fullItemName} | ${topic.topicName}`}
				description={`${fullItemName}, ${topic.topicName}, CKS`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb to="/topics/" elementType={Link}>
					Topics A to Z
				</Breadcrumb>
				<Breadcrumb to={topicPath} elementType={Link}>
					{topic.topicName}
				</Breadcrumb>
				<Breadcrumb>{fullItemName}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading={<span dangerouslySetInnerHTML={{ __html: headerNoHtml }} />}
				preheading={`${topic.topicName}: `}
				lead={<span dangerouslySetInnerHTML={{ __html: topic.lastRevised }} />}
			/>

			<ChapterContents chapter={chapter}>
				{htmlStringContentNoComments ? undefined : (
					<nav aria-labelledby={slug}>
						<h2 id={slug} className="visually-hidden">
							{headerNoHtml}
						</h2>
						<ul
							className={styles.subPagesList}
							aria-label={`Pages within ${fullItemName}`}
						>
							{subChapters.map((subChapter) => (
								<li key={subChapter.id}>
									<Link to={`${topicPath}${slug}/${subChapter.slug}/`}>
										{subChapter.fullItemName}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				)}
			</ChapterContents>
		</Layout>
	);
};

export default ChapterLevel1Page;
