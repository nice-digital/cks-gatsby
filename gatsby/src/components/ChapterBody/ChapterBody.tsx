import React from "react";

import { stripHtmlTags } from "../../utils/html-utils";
import { ChapterLevel1, ChapterLevel2 } from "../../types";

import styles from "./ChapterBody.module.scss";

interface ChapterBodyProps {
	/** The chapter, either level 1 or 2, for which to render the body */
	chapter: ChapterLevel1 | ChapterLevel2;
	/** The heading level for this chapter. Leave blank to default to an h2. */
	headingLevel?: number;
	showHeading?: boolean;
}

function isLevel2(
	chapter: ChapterLevel1 | ChapterLevel2
): chapter is ChapterLevel2 {
	return (chapter as ChapterLevel2).depth > 1;
}

/**
 * Renders the body HTML of a chapter.
 *
 * First level chapters just render the HTML for that chapter.
 * Second level chapters recursively render the HTML for nested chapters too.
 */
export const ChapterBody: React.FC<ChapterBodyProps> = ({
	chapter,
	showHeading = false,
	headingLevel = 2,
}: ChapterBodyProps) => {
	// Make sure heading levels are always correct for the depth of chapter
	const chapterHeadingHtml = [
		`<h${headingLevel}`,
		` id="${chapter.slug}"`,
		headingLevel == 2 && !showHeading ? ` class="visually-hidden">` : `>`,
		`${stripHtmlTags(chapter.htmlHeader)}`,
		`</h${headingLevel}>`,
	].join("");

	return (
		<section aria-labelledby={chapter.slug}>
			<div
				className={styles.section}
				dangerouslySetInnerHTML={{
					__html: chapterHeadingHtml + chapter.htmlStringContent,
				}}
			/>
			{isLevel2(chapter) &&
				chapter.subChapters.map((subChapter) => (
					<ChapterBody
						key={subChapter.id}
						chapter={subChapter}
						headingLevel={headingLevel + 1}
					/>
				))}
		</section>
	);
};
