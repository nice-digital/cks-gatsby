import React from "react";

import { ChapterLevel1, ChapterLevel2 } from "src/types";
import { TopicChaptersMenu } from "../TopicChaptersMenu/TopicChaptersMenu";

import styles from "./ChapterContents.module.scss";
import { ChapterBody } from "../ChapterBody/ChapterBody";

interface ChapterContentsProps {
	chapter: ChapterLevel1 | ChapterLevel2;
	children?: React.ReactElement;
}

export const ChapterContents: React.FC<ChapterContentsProps> = ({
	chapter,
	children,
}: ChapterContentsProps) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.menu}>
				<TopicChaptersMenu
					currentChapterId={chapter.id}
					topic={chapter.topic}
				/>
			</div>
			<div className={styles.body}>
				{children || <ChapterBody chapter={chapter} />}
			</div>
		</div>
	);
};
