import React, { useEffect, useState, useCallback } from "react";
import ChevronUp from "@nice-digital/icons/lib/ChevronUp";
import throttle from "lodash/throttle";

import styles from "./BackToTop.module.scss";

const scrollThreshold: number = window.innerHeight || 1000;
const scrollThrottle = 150;

interface BackToTopProps {
	scrollTargetId?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
	scrollTargetId: scrollTo = "content-start",
}: BackToTopProps) => {
	const [isFixed, setIsFixed] = useState(false);

	const handleScroll = useCallback(() => {
		const footer: Element | null = document.querySelector("footer");

		if (!footer) return;

		const footerVisible: boolean =
			window.scrollY + window.innerHeight >
			document.body.scrollHeight - footer.clientHeight;

		const scrolledDown: boolean = window.scrollY > scrollThreshold;

		setIsFixed(!footerVisible && scrolledDown);
	}, []);

	useEffect(() => {
		document.addEventListener("scroll", throttle(handleScroll, scrollThrottle));

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
