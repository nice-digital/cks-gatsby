import React, { useCallback, useEffect, useMemo, useState } from "react";

import PrintIcon from "@nice-digital/icons/lib/Print";

import { ChapterLevel1, ChapterLevel2 } from "src/types";
import { TopicChaptersMenu } from "../TopicChaptersMenu/TopicChaptersMenu";

import styles from "./ChapterContents.module.scss";
import { ChapterBody } from "../ChapterBody/ChapterBody";
import { ChapterOnThisPage } from "../ChapterOnThisPage/ChapterOnThisPage";

interface ChapterContentsProps {
	chapter: ChapterLevel1 | ChapterLevel2;
	children?: React.ReactNode;
}

export const ChapterContents: React.FC<ChapterContentsProps> = ({
	chapter,
	children,
}: ChapterContentsProps) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	const showOnthisPage = useMemo(
		() => chapter.depth == 2 && chapter.subChapters.length > 1,
		[chapter]
	);

	return (
		<div className={styles.wrapper}>
			{isClient && (
				<button
					type="button"
					className={styles.printBtn}
					onClick={handlePrint}
					data-tracking="print"
				>
					<PrintIcon className={null} />
					Print this page
				</button>
			)}
			<div className={styles.menu}>
				<TopicChaptersMenu
					currentChapterId={chapter.id}
					topic={chapter.topic}
				/>
			</div>
			{showOnthisPage && (
				<div className={styles.onThisPage}>
					<ChapterOnThisPage chapter={chapter as ChapterLevel2} />
				</div>
			)}
			<div className={styles.body}>
				{children || <ChapterBody chapter={chapter} />}
			</div>
		</div>
	);
};
