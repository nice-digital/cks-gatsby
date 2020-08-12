import React from "react";
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
		<StackedNav aria-label={`${topic.topicName} chapters`}>
			{topic.chapters.map(({ id, slug, fullItemName, subChapters }, i) => {
				const shouldShowSubChapters =
					id === currentChapterId ||
					subChapters.some((c) => c.id === currentChapterId);

				// The summary chapter links to the topic landing page
				const chapterPath = i === 0 ? topicPath : `${topicPath}${slug}/`;

				return (
					<StackedNavLink
						data-tracking={fullItemName}
						key={id}
						elementType={Link}
						destination={chapterPath}
						isCurrent={id === currentChapterId}
						nested={
							shouldShowSubChapters &&
							subChapters.map((subChapter) => (
								<StackedNavLink
									data-tracking={`${fullItemName} | ${subChapter.fullItemName}`}
									key={subChapter.id}
									elementType={Link}
									destination={`${chapterPath}${subChapter.slug}/`}
									isCurrent={subChapter.id === currentChapterId}
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
	);
};
