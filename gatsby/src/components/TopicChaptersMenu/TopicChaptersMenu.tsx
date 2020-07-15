import React, { Fragment } from "react";
import { Link } from "gatsby";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { PartialTopicWithChapters } from "src/types";

type TopicChaptersMenuProps = {
	topic: PartialTopicWithChapters;
	/** The (optional) id of the currently active chapter */
	currentChapterId?: string;
};

/**
 * Renders the side, stacked navigation of chapters within the given topic.
 */
export const TopicChaptersMenu: React.FC<TopicChaptersMenuProps> = ({
	topic,
	currentChapterId,
}: TopicChaptersMenuProps) => {
	const topicPath = `/topics/${topic.slug}/`;

	return (
		<StackedNav>
			{topic.chapters.map((chapter, i) => {
				const shouldShowSubNav =
					chapter.id === currentChapterId ||
					chapter.subChapters.some(c => c.id === currentChapterId);

				// The summary chapter links to the topic landing page
				const chapterPath =
					i === 0 ? topicPath : `${topicPath}${chapter.slug}/`;

				return (
					<Fragment key={chapter.id}>
						<StackedNavLink
							elementType={Link}
							destination={chapterPath}
							isCurrent={chapter.id === currentChapterId}
						>
							{chapter.fullItemName}
						</StackedNavLink>

						{shouldShowSubNav &&
							chapter.subChapters.map(subChapter => (
								<StackedNavLink
									key={subChapter.id}
									elementType={Link}
									destination={`${chapterPath}${subChapter.slug}/`}
									isCurrent={subChapter.id === currentChapterId}
								>
									{/* TODO: Replace these spaces with a proper nested stacked nav when it supports nesting */}
									&nbsp;&nbsp;&nbsp;&nbsp; {subChapter.fullItemName}
								</StackedNavLink>
							))}
					</Fragment>
				);
			})}
		</StackedNav>
	);
};
