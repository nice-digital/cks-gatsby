import React, { useEffect, useCallback, useRef, useState } from "react";
import throttle from "lodash.throttle";

import { ChapterLevel2 } from "src/types";
import styles from "./ChapterOnThisPage.module.scss";

interface ChapterOnThisPageProps {
	chapter: ChapterLevel2;
}

interface PositionedHeading {
	id: string;
	/**
	 * The y position of this heading element, relative to the viewport
	 */
	y: number;
}

/**
 * The number of pixels offset for considering an element to be at the top of the page
 */
const scrollTolerance = 100;

/**
 * The number of milliseconds to throttle the scroll event handler
 */
const scrollThrottle = 100;

/**
 * Uses the given anchor's href attribute to look for a corresponsing element with a matching id.
 * Assumes the anchor has a hash href to a heading on this page.
 * @param anchor The anchor html element
 */
const anchorToHeading = (anchor: HTMLAnchorElement): PositionedHeading => {
	const href = anchor.getAttribute("href") as string,
		heading = document.querySelector(href) as HTMLElement;
	return {
		id: heading.getAttribute("id") as string,
		y: heading.getBoundingClientRect().top,
	};
};

const isScrolledPast = (heading: PositionedHeading): boolean =>
	heading.y - scrollTolerance <= 0;

export const ChapterOnThisPage: React.FC<ChapterOnThisPageProps> = ({
	chapter,
}: ChapterOnThisPageProps) => {
	const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

	const containerRef = useRef<HTMLElement>(null);

	const scrollHandler = useCallback(
		throttle(() => {
			if (!containerRef.current) return;

			const headings = Array.from(containerRef.current.querySelectorAll("a"))
				.map(anchorToHeading)
				.filter(isScrolledPast);

			if (headings.length === 0) return setActiveHeadingId(null);

			// Find the 'lowest' heading which represents the active one
			const activeHeading = headings.reduce((prev, current) => {
				return prev.y > current.y ? prev : current;
			});

			setActiveHeadingId(activeHeading.id);
		}, scrollThrottle),
		[containerRef.current]
	);

	useEffect(() => {
		window.addEventListener("scroll", scrollHandler);
		return () => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, []);

	return (
		<nav
			className={styles.wrapper}
			aria-labelledby="on-this-page"
			ref={containerRef}
		>
			<h2 className={styles.heading} id="on-this-page">
				On this page
			</h2>
			<ol className={styles.rootList} aria-label="Sections on this">
				{(chapter as ChapterLevel2).subChapters.map(
					({ slug, id, fullItemName, subChapters }) => {
						const href = `#${slug}`,
							isCurrent = slug === activeHeadingId,
							hasActiveChild = subChapters.some(
								(s) => s.slug === activeHeadingId
							);

						return (
							<li key={id}>
								<a
									href={href}
									aria-current={isCurrent ? "location" : undefined}
								>
									{fullItemName}
								</a>
								{subChapters.length > 0 && (
									<ol
										aria-label={`Sections within ${fullItemName}`}
										className={`${styles.subList} ${
											isCurrent || hasActiveChild ? styles.expandedSubList : ""
										}`}
									>
										{subChapters.map((subSubChapter) => (
											<li key={subSubChapter.id}>
												<a
													href={`#${subSubChapter.slug}`}
													aria-current={
														subSubChapter.slug === activeHeadingId
															? "location"
															: undefined
													}
												>
													{subSubChapter.fullItemName}
												</a>
											</li>
										))}
									</ol>
								)}
							</li>
						);
					}
				)}
			</ol>
		</nav>
	);
};
