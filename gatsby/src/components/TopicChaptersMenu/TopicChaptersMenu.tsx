import React from "react";
import { Link } from "gatsby";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { PartialTopicWithChapters } from "src/types";

type TopicChaptersMenuProps = {
	topic: PartialTopicWithChapters;
	currentChapterId: string;
};

export const TopicChaptersMenu: React.FC<TopicChaptersMenuProps> = ({
	topic,
	currentChapterId,
}: TopicChaptersMenuProps) => {
	const topicPath = `/topics/${topic.slug}/`;

	// Remove the summary chapter as this is the topic root
	const menuChapters = topic.chapters.slice(1);

	return (
		<StackedNav
			label={topic.topicName}
			elementType="h2"
			link={{
				destination: topicPath,
				elementType: Link,
				isCurrent: topic.chapters[0].id === currentChapterId,
			}}
		>
			{menuChapters.map(menuChapter => {
				const shouldShowSubNav =
					menuChapter.id === currentChapterId ||
					menuChapter.subChapters.some(c => c.id === currentChapterId);

				const chapterPath = `${topicPath}${menuChapter.slug}/`;

				return (
					<>
						<StackedNavLink
							key={menuChapter.id}
							elementType={Link}
							destination={chapterPath}
							isCurrent={menuChapter.id === currentChapterId}
						>
							{menuChapter.fullItemName}
						</StackedNavLink>

						{shouldShowSubNav &&
							menuChapter.subChapters.map(subChapter => (
								<StackedNavLink
									key={subChapter.id}
									elementType={Link}
									destination={`${chapterPath}${subChapter.slug}/`}
									isCurrent={subChapter.id === currentChapterId}
								>
									-- {subChapter.fullItemName}
								</StackedNavLink>
							))}
					</>
				);
			})}
		</StackedNav>
	);
};
