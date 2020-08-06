import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	MouseEvent,
	KeyboardEvent,
} from "react";

import ChevronDownIcon from "@nice-digital/icons/lib/ChevronDown";
import ChevronUpIcon from "@nice-digital/icons/lib/ChevronUp";

import { stripHtmlTags, stripHtmlComments } from "../../utils/html-utils";

import { ChapterLevel1, ChapterLevel2 } from "../../types";

import styles from "./ChapterBody.module.scss";

const BasisChapterTitle = "Basis for recommendation";

const EnterKeyCode = 13;
const SpaceKeyCode = 32;

interface ChapterBodyProps {
	/** The chapter, either level 1 or 2, for which to render the body */
	chapter: ChapterLevel1 | ChapterLevel2;
	/** The heading level for this chapter. Leave blank to default to an h2. */
	headingLevel?: number;
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
	headingLevel = 2,
}: ChapterBodyProps) => {
	const isBasis = chapter.fullItemName == BasisChapterTitle;

	const [isBasisExpanded, setIsBasisExpanded] = useState(true);

	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
		setIsBasisExpanded(false);
	}, []);

	const basisClickHandler = useCallback(
		(e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => {
			if (e.type === "keydown") {
				const { which } = e as KeyboardEvent<HTMLButtonElement>;
				if (which !== EnterKeyCode && which !== SpaceKeyCode) return;
				// Stop 'click' event from firing too
				e.preventDefault();
			} else if (e.type === "click") e.currentTarget.blur();

			setIsBasisExpanded((isExpanded) => !isExpanded);
		},
		[]
	);

	// Make sure heading levels are always correct for the depth of chapter
	// See https://stackoverflow.com/a/59685929/486434 for as keyof JSX.IntrinsicElements explanation
	const HeadingElementType = `h${headingLevel}` as keyof JSX.IntrinsicElements;

	const headerText = useMemo(() => stripHtmlTags(chapter.htmlHeader), [
		chapter.htmlHeader,
	]);

	const htmlStringContentNoComments = useMemo(
		() => stripHtmlComments(chapter.htmlStringContent),
		[chapter.htmlStringContent]
	);

	return (
		<section
			aria-labelledby={chapter.slug}
			className={`${styles.wrapper} ${
				isClient && isBasis ? styles.basisWrapper : ""
			}`}
		>
			{isClient && isBasis ? (
				<div className={styles.headerWrapper}>
					<HeadingElementType
						className="h4"
						id={chapter.slug}
						dangerouslySetInnerHTML={{ __html: headerText }}
					/>
					<button
						type="button"
						className={styles.toggleBtn}
						onClick={basisClickHandler}
						onKeyDown={basisClickHandler}
						aria-expanded={isBasisExpanded}
						data-tracking="basis"
					>
						{isBasisExpanded ? (
							<>
								<ChevronUpIcon /> Hide
							</>
						) : (
							<>
								<ChevronDownIcon /> Show
							</>
						)}{" "}
						<span className="visually-hidden">{headerText}</span>
					</button>
				</div>
			) : (
				<HeadingElementType
					id={chapter.slug}
					dangerouslySetInnerHTML={{ __html: headerText }}
					className={headingLevel == 2 ? "visually-hidden" : undefined}
				/>
			)}
			{htmlStringContentNoComments ? (
				<div
					className={styles.body}
					aria-hidden={isBasis && !isBasisExpanded}
					dangerouslySetInnerHTML={{
						__html: chapter.htmlStringContent,
					}}
				/>
			) : null}
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
