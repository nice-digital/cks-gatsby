import React, { useMemo, ReactElement } from "react";
import { Link } from "gatsby";

import { stripHtmlComments, stripHtmlTags } from "../../utils/html-utils";
import { Chapter } from "../../types";

import styles from "./ChapterBody.module.scss";

interface ChapterBodyProps {
	chapter: Chapter;
	/**
	 * Whether to visually show the root h2 heading.
	 * Setting to `false` adds a class of `visually-hidden`.
	 */
	showRootHeading?: boolean;
}

export const ChapterBody: React.FC<ChapterBodyProps> = ({
	chapter,
	showRootHeading,
}: ChapterBodyProps) => {
	const {
		slug,
		htmlHeader,
		htmlStringContent,
		topic,
		parentChapter,
		subChapters,
	} = chapter;

	const headerNoHtml = useMemo(() => stripHtmlTags(htmlHeader), [htmlHeader]);

	const htmlStringContentNoComments = useMemo(
		() => stripHtmlComments(htmlStringContent),
		[htmlStringContent]
	);

	const renderChapterHTML = useMemo(
		() => (c: Chapter): ReactElement => {
			const chapterHeading =
				c === chapter
					? `<h2${
							showRootHeading ? "" : ' class="visually-hidden"'
					  }>${headerNoHtml}</h2>`
					: c.htmlHeader;

			return (
				<section id={c.slug} aria-label={c.fullItemName}>
					<div
						className={styles.section}
						dangerouslySetInnerHTML={{
							__html: chapterHeading + c.htmlStringContent,
						}}
					/>
					{c.subChapters &&
						c.parentChapter &&
						c.subChapters.map(subChapter => renderChapterHTML(subChapter))}
				</section>
			);
		},
		[]
	);

	return (
		<>
			{parentChapter || htmlStringContentNoComments ? (
				useMemo(() => renderChapterHTML(chapter), [chapter])
			) : (
				<nav className={styles.section} aria-labelledby={slug}>
					<h2 className="visually-hidden" id={slug}>
						{headerNoHtml}
					</h2>
					<ul className="mt--0" aria-labelledby={slug}>
						{subChapters.map(subChapter => (
							<li key={subChapter.id}>
								<Link to={`/topics/${topic.slug}/${slug}/${subChapter.slug}/`}>
									{subChapter.fullItemName}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			)}
		</>
	);
};
