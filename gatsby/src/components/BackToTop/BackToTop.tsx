import React, { useEffect, useState, useCallback } from "react";
import ChevronUp from "@nice-digital/icons/lib/ChevronUp";

import styles from "./BackToTop.module.scss";

interface BackToTopProps {
	scrollTargetId?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
	scrollTargetId: scrollTo = "content-start",
}: BackToTopProps) => {
	const [isFixed, setIsFixed] = useState(false);

	const handleScroll = useCallback(() => {
		const footer = document.querySelector("footer");
		if (!footer) return;
		const footerVisible =
			window.scrollY + window.innerHeight >
			document.body.scrollHeight - footer.clientHeight;
		// const scrolledDown = window.scrollY > 200;
		setIsFixed(!footerVisible);
		// setIsFixed(!footerVisible && scrolledDown);
	}, []);

	useEffect(() => {
		document.addEventListener("scroll", handleScroll);
		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className={isFixed ? styles.fixed : styles.static}>
			<div className="container">
				<a href={`#${scrollTo}`}>
					<ChevronUp /> Back to top
				</a>
			</div>
		</div>
	);
};
