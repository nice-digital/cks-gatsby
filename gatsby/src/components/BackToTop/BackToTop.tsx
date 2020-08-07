import React, { useEffect, useState, useCallback } from "react";
import ChevronUp from "@nice-digital/icons/lib/ChevronUp";
import throttle from "lodash/throttle";

import styles from "./BackToTop.module.scss";

let scrollThreshold = 1000;
const scrollThrottle = 150;

if (typeof window !== `undefined`) {
	scrollThreshold = window.innerHeight * 2;
}

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
		<nav
			aria-labelledby="back-to-top-link"
			className={isFixed ? styles.fixed : styles.static}
		>
			<div className="container">
				<a id="back-to-top-link" href={`#${scrollTo}`}>
					<ChevronUp /> Back to top
				</a>
			</div>
		</nav>
	);
};
