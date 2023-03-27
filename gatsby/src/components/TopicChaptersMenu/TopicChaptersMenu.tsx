import React, { useState, useCallback, useEffect } from "react";
import { Link } from "gatsby";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";
import ChevronDownIcon from "@nice-digital/icons/lib/ChevronDown";

import {
	ChapterLevel1,
	ChapterLevel2,
	PartialTopicWithChapters,
} from "src/types";

import styles from "./TopicChaptersMenu.module.scss";

type TopicChaptersMenuProps = {
	topic: PartialTopicWithChapters;
	/** The (optional) id of the currently active chapter */
	currentChapter: ChapterLevel1 | ChapterLevel2;
};

/**
 * Renders the side, stacked navigation of chapters within the given topic.
 */
export const TopicChaptersMenu: React.FC<TopicChaptersMenuProps> = ({
	topic,
	currentChapter,
}: TopicChaptersMenuProps) => {
	const topicPath = `/topics/${topic.slug}/`;

	const [isExpanded, setIsExpanded] = useState(true);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsExpanded(false);
		setIsClient(false);
	}, []);

	const clickHandler = useCallback(() => {
		setIsExpanded((s) => !s);
	}, []);

	return (
		<div className={styles.wrapper}>
			{isClient ? (
				<button
					type="button"
					className={styles.toggleButton}
					onClick={clickHandler}
					aria-expanded={isExpanded}
					aria-label={`${isExpanded ? "Collapse" : "Expand"} menu for ${
						topic.topicName
					}`}
				>
					{currentChapter.fullItemName}{" "}
					<ChevronDownIcon className={styles.icon} />
				</button>
			) : (
				<a className={styles.toggleButton} href="#topic-menu">
					{currentChapter.fullItemName}{" "}
					<ChevronDownIcon className={styles.icon} />
				</a>
			)}
			<StackedNav
				aria-label={`${topic.topicName} chapters`}
				className="mb--0"
				id="topic-menu"
			>
				{topic.chapters.map(({ id, slug, fullItemName, subChapters }, i) => {
					const shouldShowSubChapters =
						id === currentChapter.id ||
						subChapters.some((c) => c.id === currentChapter.id);

					// The summary chapter links to the topic landing page
					const chapterPath = i === 0 ? topicPath : `${topicPath}${slug}/`;

					return (
						<StackedNavLink
							data-tracking={fullItemName}
							key={id}
							elementType={Link}
							destination={chapterPath}
							isCurrent={id === currentChapter.id}
							nested={
								shouldShowSubChapters &&
								subChapters.map((subChapter) => (
									<StackedNavLink
										data-tracking={`${fullItemName} | ${subChapter.fullItemName}`}
										key={subChapter.id}
										elementType={Link}
										destination={`${chapterPath}${subChapter.slug}/`}
										isCurrent={subChapter.id === currentChapter.id}
									>
										{subChapter.fullItemName}
									</StackedNavLink>
								))
							}
						>
							{fullItemName}
						</StackedNavLink>
					);
				})}
			</StackedNav>
		</div>
	);
};
