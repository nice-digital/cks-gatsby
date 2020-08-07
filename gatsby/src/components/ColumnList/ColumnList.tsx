import React from "react";

import styles from "./ColumnList.module.scss";

interface ColumnListProps {
	children: React.ReactNode;
	plain?: boolean;
	className?: string;
	/** Number of columns on desktop-width screens */
	columns?: 2 | 3;
	[prop: string]: unknown;
}

export const ColumnList: React.FC<ColumnListProps> = ({
	children,
	plain,
	columns,
	className,
	...attrs
}: ColumnListProps) => (
	<ol
		className={[
			plain ? styles.plain : styles.boxed,
			columns ? styles[`cols${columns}`] : "",
			className,
		]
			.filter(Boolean)
			.join(" ")}
		{...attrs}
	>
		{children}
	</ol>
);
