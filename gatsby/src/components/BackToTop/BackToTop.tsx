import React from "react";

import styles from "./BackToTop.module.scss";

interface BackToTopProps {
	scrollTo?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
	scrollTo = "content-start",
}: BackToTopProps) => (
	<div className={styles.wrapper}>
		<div className="container">
			<a href={`#${scrollTo}`}>Back to top (going to scroll to #{scrollTo})</a>
		</div>
	</div>
);
