import React, { useMemo } from "react";
import { PageProps, Link } from "gatsby";

import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ChapterLevel2 } from "../../types";
import { SEO } from "../../components/SEO/SEO";
import { ChapterContents } from "../../components/ChapterContents/ChapterContents";
import { stripHtmlTags } from "../../utils/html-utils";

interface ChapterPageContext {
	chapter: ChapterLevel2;
}

export type ChapterLevel2PageProps = PageProps<null, ChapterPageContext>;

const ChapterLevel2Page: React.FC<ChapterLevel2PageProps> = ({
	pageContext: { chapter },
}: ChapterLevel2PageProps) => {
	const { fullItemName, htmlHeader, summary, topic, parentChapter } = chapter;

	const topicPath = `/topics/${topic.slug}/`;

	const headerNoHtml = useMemo(() => stripHtmlTags(htmlHeader), [htmlHeader]);

	return (
		<>
			<SEO
				title={`${fullItemName} | ${parentChapter.fullItemName} | ${topic.topicName}`}
				description={
					summary ||
					`${fullItemName}, ${parentChapter.fullItemName}, ${topic.topicName}, CKS`
				}
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
				<Breadcrumb
					to={`${topicPath}${parentChapter.slug}/`}
					elementType={Link}
				>
					{parentChapter.fullItemName}
				</Breadcrumb>
				<Breadcrumb>{fullItemName}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				id="content-start"
				heading={<span dangerouslySetInnerHTML={{ __html: headerNoHtml }} />}
				preheading={`${topic.topicName}: `}
				lead={<span dangerouslySetInnerHTML={{ __html: topic.lastRevised }} />}
			/>

			{summary && <p className="visually-hidden">{summary}</p>}

			<ChapterContents chapter={chapter} />
		</>
	);
};

export default ChapterLevel2Page;
