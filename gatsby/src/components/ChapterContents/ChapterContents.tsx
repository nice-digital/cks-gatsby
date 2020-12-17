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
	showHeading?: boolean;
}

export const ChapterContents: React.FC<ChapterContentsProps> = ({
	chapter,
	children,
	showHeading,
}: ChapterContentsProps) => {
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

	const { subChapters } = chapter;
	const showOnthisPage = useMemo(
		() =>
			chapter.depth == 2 &&
			(subChapters.length > 1 ||
				(subChapters.length === 1 && subChapters[0].subChapters.length > 0)),
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
					<ChapterOnThisPage subChapters={subChapters} />
				</div>
			)}
			{children ? <div className={styles.landing}>{children}</div> : null}
			<div className={styles.body}>
				<ChapterBody chapter={chapter} showHeading={showHeading} />
			</div>
		</div>
	);
};
