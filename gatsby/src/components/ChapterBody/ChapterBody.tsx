import React, { useMemo } from "react";
import { Link } from "gatsby";

import { stripHtmlComments, stripHtmlTags } from "../../utils/html-utils";
import { Chapter } from "../../types";

import styles from "./ChapterBody.module.scss";

interface ChapterBodyProps {
	chapter: Chapter;
}

export const ChapterBody: React.FC<ChapterBodyProps> = ({
	chapter: {
		slug,
		htmlHeader,
		htmlStringContent,
		topic,
		parentChapter,
		subChapters,
	},
}: ChapterBodyProps) => {
	const headerNoHtml = useMemo(() => stripHtmlTags(htmlHeader), [htmlHeader]);

	const htmlStringContentNoComments = useMemo(
		() => stripHtmlComments(htmlStringContent),
		[htmlStringContent]
	);

	return (
		<>
			{!parentChapter && htmlStringContentNoComments === "" ? (
				<ul className="mt--0">
					{subChapters.map(subChapter => (
						<li key={subChapter.id}>
							<Link to={`/topics/${topic.slug}/${slug}/${subChapter.slug}/`}>
								{subChapter.fullItemName}
							</Link>
						</li>
					))}
				</ul>
			) : (
				<>
					TODO: Recurse to get chapter body...
					<section className={styles.body} id={slug} aria-label={headerNoHtml}>
						<div
							dangerouslySetInnerHTML={{
								__html: htmlStringContent,
							}}
						/>
						{parentChapter &&
							subChapters.map(subChapter => (
								<section key={subChapter.id} id={subChapter.slug}>
									<div
										dangerouslySetInnerHTML={{
											__html:
												subChapter.htmlHeader + subChapter.htmlStringContent,
										}}
									/>
									{subChapter.subChapters.map(subChapter => (
										<section
											id={subChapter.slug}
											key={subChapter.id}
											dangerouslySetInnerHTML={{
												__html:
													subChapter.htmlHeader + subChapter.htmlStringContent,
											}}
										/>
									))}
								</section>
							))}
					</section>
				</>
			)}
		</>
	);
};
