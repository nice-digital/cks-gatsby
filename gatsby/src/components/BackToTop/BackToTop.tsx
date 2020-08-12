import React, { useEffect, useState, useCallback } from "react";
import ChevronUp from "@nice-digital/icons/lib/ChevronUp";
import throttle from "lodash.throttle";

import styles from "./BackToTop.module.scss";

const scrollThrottle = 100;
const pagesScrollThreshold = 1; // number of viewports to scroll before "back to top" appears

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
			footer.getBoundingClientRect().top - window.innerHeight < 0;

		const scrolledDown: boolean =
			document.documentElement.scrollTop >
			window.innerHeight * pagesScrollThreshold;

		setIsFixed(!footerVisible && scrolledDown);
	}, []);

	const throttledHandleScroll = useCallback(
		throttle(handleScroll, scrollThrottle),
		[]
	);

	useEffect(() => {
		document.addEventListener("scroll", throttledHandleScroll);

		return () => {
			document.removeEventListener("scroll", throttledHandleScroll);
		};
	}, []);

	return (
		<nav
			aria-labelledby="back-to-top-link"
			className={["hide-print", isFixed ? styles.fixed : styles.static].join(
				" "
			)}
		>
			<div className="container">
				<a id="back-to-top-link" href={`#${scrollTo}`}>
					<ChevronUp /> Back to top
				</a>
			</div>
		</nav>
	);
};
