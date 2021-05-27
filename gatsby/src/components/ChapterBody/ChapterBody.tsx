import React, { useMemo } from "react";

import ChevronDownIcon from "@nice-digital/icons/lib/ChevronDown";
import "@nice-digital/nds-table/scss/table.scss";

import { stripHtmlTags, stripHtmlComments } from "../../utils/html-utils";
import { BasisChapterTitle } from "../../utils/constants";

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
	const isBasis = chapter.fullItemName == BasisChapterTitle;

	// Make sure heading levels are always correct for the depth of chapter
	// See https://stackoverflow.com/a/59685929/486434 for as keyof JSX.IntrinsicElements explanation
	const HeadingElementType = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	const headerText = useMemo(
		() => stripHtmlTags(chapter.htmlHeader),
		[chapter.htmlHeader]
	);

	const htmlStringContentNoComments = useMemo(
		() => stripHtmlComments(chapter.htmlStringContent),
		[chapter.htmlStringContent]
	);

	const body = htmlStringContentNoComments ? (
		<div
			className={styles.body}
			dangerouslySetInnerHTML={{
				__html: chapter.htmlStringContent,
			}}
		/>
	) : null;

	return (
		<section aria-labelledby={chapter.slug} className={styles.wrapper}>
			{isBasis ? (
				<details className={styles.details}>
					<summary>
						<HeadingElementType
							className="h4"
							id={chapter.slug}
							dangerouslySetInnerHTML={{ __html: headerText }}
						/>
						<ChevronDownIcon />
					</summary>
					{body}
				</details>
			) : (
				<>
					<HeadingElementType
						id={chapter.slug}
						dangerouslySetInnerHTML={{ __html: headerText }}
						className={
							headingLevel == 2 && !showHeading ? "visually-hidden" : undefined
						}
					/>
					{body}
				</>
			)}
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
