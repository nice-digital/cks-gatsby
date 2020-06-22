import React, { useMemo } from "react";
import { PageProps, Link } from "gatsby";

import { PageHeader } from "@nice-digital/nds-page-header";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Layout } from "../../components/Layout/Layout";
import { ChapterLevel2 } from "../../types";
import { SEO } from "../../components/SEO/SEO";
import { stripHtmlTags } from "../../utils/html-utils";
import { ChapterBody } from "../../components/ChapterBody/ChapterBody";
import { ChapterContents } from "src/components/ChapterContents/ChapterContents";

interface ChapterPageContext {
	chapter: ChapterLevel2;
}

type ChapterPageProps = PageProps<null, ChapterPageContext>;

const ChapterLevel2Page: React.FC<ChapterPageProps> = ({
	pageContext: { chapter },
}: ChapterPageProps) => {
	const { fullItemName, htmlHeader, topic, parentChapter } = chapter;

	const topicPath = `/topics/${topic.slug}/`;

	const headerNoHtml = useMemo(() => stripHtmlTags(htmlHeader), [htmlHeader]);

	return (
		<Layout>
			<SEO
				title={`${fullItemName} | ${parentChapter.fullItemName} | ${topic.topicName}`}
				description={`${fullItemName}, ${parentChapter.fullItemName}, ${topic.topicName}, CKS`}
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
				<Breadcrumb
					to={`${topicPath}${parentChapter.slug}/`}
					elementType={Link}
				>
					{parentChapter.fullItemName}
				</Breadcrumb>
				<Breadcrumb>{fullItemName}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading={<span dangerouslySetInnerHTML={{ __html: headerNoHtml }} />}
				preheading={`${topic.topicName}: `}
			/>

			<ChapterContents chapter={chapter} />
		</Layout>
	);
};

export default ChapterLevel2Page;
