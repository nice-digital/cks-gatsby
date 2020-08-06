import React, { useCallback, useEffect, useState } from "react";

import PrintIcon from "@nice-digital/icons/lib/Print";

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
	const [isClient, setIsClient] = useState(false);
	useEffect(() => {
		setIsClient(true);
	}, []);

	const handlePrint = useCallback(() => {
		window.print();
	}, []);

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
			<div className={styles.body}>
				{children || <ChapterBody chapter={chapter} />}
			</div>
		</div>
	);
};
