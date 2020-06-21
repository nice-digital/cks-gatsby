import React from "react";

import { stripHtmlTags } from "../../utils/html-utils";
import { ChapterLevel1, ChapterLevel2 } from "../../types";

import styles from "./ChapterBody.module.scss";

interface ChapterBodyProps {
	chapter: ChapterLevel1 | ChapterLevel2;
	headingLevel?: number;
}

function isLevel2(
	chapter: ChapterLevel1 | ChapterLevel2
): chapter is ChapterLevel2 {
	return (chapter as ChapterLevel2).depth > 1;
}

export const ChapterBody: React.FC<ChapterBodyProps> = ({
	chapter,
	headingLevel = 2,
}: ChapterBodyProps) => {
	// Make sure heading levels are always correct for the depth of chapter
	const chapterHeadingHtml = [
		`<h${headingLevel}`,
		` id="${chapter.slug}"`,
		headingLevel == 2 ? ` class="visually-hidden">` : `>`,
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
				chapter.subChapters.map(subChapter => (
					<ChapterBody
						key={subChapter.id}
						chapter={subChapter}
						headingLevel={headingLevel + 1}
					/>
				))}
		</section>
	);
};
