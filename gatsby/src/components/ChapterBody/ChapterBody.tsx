import React, { useMemo, ReactElement } from "react";
import { Link } from "gatsby";

import {
	stripHtmlComments,
	stripHtmlTags,
	insertId,
} from "../../utils/html-utils";
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
			// Rewrite the root heading from an h1 into an h2.
			// This is because we render separate pages which have their own h1 (rather than a long single page like Clarity's)
			const chapterHeading =
				c === chapter
					? `<h2 id="${c.slug}"${
							showRootHeading ? "" : ' class="visually-hidden"'
					  }>${headerNoHtml}</h2>`
					: insertId(c.htmlHeader, c.slug);

			return (
				<section aria-labelledby={c.slug}>
					<div
						className={styles.section}
						dangerouslySetInnerHTML={{
							__html: chapterHeading + c.htmlStringContent,
						}}
					/>
					{c.parentChapter &&
						c.subChapters &&
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
					<h2 className={showRootHeading ? "" : "visually-hidden"} id={slug}>
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
