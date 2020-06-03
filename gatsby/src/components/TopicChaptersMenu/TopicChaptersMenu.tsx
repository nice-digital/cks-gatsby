import React from "react";
import { Link } from "gatsby";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { PartialTopicWithChapters } from "src/types";

type TopicChaptersMenuProps = {
	topic: PartialTopicWithChapters;
	chapterId: string;
};

export const TopicChaptersMenu: React.FC<TopicChaptersMenuProps> = ({
	topic,
	chapterId,
}: TopicChaptersMenuProps) => {
	const topicPath = `/topics/${topic.slug}/`;

	// Remove the summary chapter as this topic root
	const menuChapters = topic.chapters.slice(1);

	return (
		<StackedNav
			label={topic.topicName}
			elementType="h2"
			link={{
				destination: topicPath,
				elementType: Link,
				isCurrent: topic.chapters[0].id === chapterId,
			}}
		>
			{menuChapters.map(menuChapter => {
				const shouldShowSubNav =
					menuChapter.id === chapterId ||
					menuChapter.subChapters.some(c => c.id === chapterId);

				const chapterPath = `${topicPath}${menuChapter.slug}/`;

				return (
					<StackedNavLink
						key={menuChapter.id}
						elementType={Link}
						destination={chapterPath}
						isCurrent={menuChapter.id === chapterId}
					>
						{menuChapter.fullItemName}
						{shouldShowSubNav &&
							menuChapter.subChapters.map(subChapter => (
								<StackedNavLink
									key={subChapter.id}
									elementType={Link}
									destination={`${chapterPath}${subChapter.slug}/`}
									isCurrent={subChapter.id === chapterId}
								>
									{subChapter.fullItemName}
								</StackedNavLink>
							))}
					</StackedNavLink>
				);
			})}
		</StackedNav>
	);
};
