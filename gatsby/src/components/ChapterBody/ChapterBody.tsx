import React from "react";

import { insertId, stripHtmlTags } from "../../utils/html-utils";
import { ChapterLevel1, ChapterLevel2 } from "../../types";

import styles from "./ChapterBody.module.scss";

interface ChapterBodyProps {
	chapter: ChapterLevel1 | ChapterLevel2;
}

function isLevel2(
	chapter: ChapterLevel1 | ChapterLevel2
): chapter is ChapterLevel2 {
	return (chapter as ChapterLevel2).depth > 1;
}

export const ChapterBody: React.FC<ChapterBodyProps> = ({
	chapter,
}: ChapterBodyProps) => {
	const chapterHeadingHtml = `<h2 id="${
		chapter.slug
	}" class="visually-hidden">${stripHtmlTags(chapter.htmlHeader)}</h2>`;

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
					<ChapterBody key={subChapter.id} chapter={subChapter} />
				))}
		</section>
	);
};
