import React from "react";

import styles from "./ColumnList.module.scss";

interface ColumnListProps {
	children: React.ReactNode;
	plain?: boolean;
	[prop: string]: unknown;
}

export const ColumnList: React.FC<ColumnListProps> = ({
	children,
	plain,
	...attrs
}: ColumnListProps) => (
	<ol className={plain ? styles.plain : styles.boxed} {...attrs}>
		{children}
	</ol>
);
