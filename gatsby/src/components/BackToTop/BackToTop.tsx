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
		const footer: Element | null = document.querySelector("footer");

		if (!footer) return;

		const footerVisible: boolean =
			window.scrollY + window.innerHeight >
			document.body.scrollHeight - footer.clientHeight;

		const scrolledDown: boolean = window.scrollY > 800;

		setIsFixed(!footerVisible && scrolledDown);
	}, []);

	useEffect(() => {
		document.addEventListener("scroll", handleScroll);

		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			role="navigation"
			aria-label="Back to top"
			className={isFixed ? styles.fixed : styles.static}
		>
			<div className="container">
				<a href={`#${scrollTo}`}>
					<ChevronUp /> Back to top
				</a>
			</div>
		</div>
	);
};
