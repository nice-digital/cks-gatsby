import React from "react";

import styles from "./ColumnList.module.scss";

interface ColumnListProps {
	children: React.ReactNode;
	[prop: string]: unknown;
}

export const ColumnList: React.FC<ColumnListProps> = ({
	children,
	...attrs
}: ColumnListProps) => (
	<ol className={styles.list} {...attrs}>
		{children}
	</ol>
);
