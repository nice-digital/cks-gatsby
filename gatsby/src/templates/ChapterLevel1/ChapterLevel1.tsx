import React, { useMemo } from "react";
import { PageProps, Link } from "gatsby";

import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ChapterLevel1 } from "../../types";
import { Layout } from "../../components/Layout/Layout";
import { SEO } from "../../components/SEO/SEO";
import { ChapterBody } from "../../components/ChapterBody/ChapterBody";
import { ChapterContents } from "../../components/ChapterContents/ChapterContents";
import { stripHtmlTags } from "../../utils/html-utils";

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
		summary,
		topic,
		subChapters,
	} = chapter;

	const topicPath = `/topics/${topic.slug}/`;

	const headerNoHtml = useMemo(() => stripHtmlTags(htmlHeader), [htmlHeader]);

	return (
		<Layout>
			<SEO
				title={`${fullItemName} | ${topic.topicName}`}
				description={summary || `${fullItemName}, ${topic.topicName}, CKS`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb to="/topics/" elementType={Link}>
					Health topics A to Z
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
				<ChapterBody chapter={chapter} showHeading={false} />
				{subChapters.length === 0 ? undefined : (
					<nav aria-labelledby={slug}>
						<ul
							className={styles.subPagesList}
							aria-label={`Pages within ${fullItemName}`}
						>
							{subChapters.map((subChapter) => (
								<li key={subChapter.id}>
									<Link to={`${topicPath}${slug}/${subChapter.slug}/`}>
										{subChapter.fullItemName}
									</Link>
									{subChapter.summary && <>: {subChapter.summary}</>}
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
