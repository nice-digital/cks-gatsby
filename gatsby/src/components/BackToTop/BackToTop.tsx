import React, { useEffect, useState } from "react";

import styles from "./BackToTop.module.scss";

interface BackToTopProps {
	scrollTo?: string;
}

export const BackToTop: React.FC<BackToTopProps> = ({
	scrollTo = "content-start",
}: BackToTopProps) => {
	const [isFixed, setIsFixed] = useState(false);

	function handleScroll() {
		const footer = document.querySelector("footer");
		if (!footer) return;
		const footerVisible =
			window.scrollY + window.innerHeight >
			document.body.scrollHeight - footer.clientHeight;
		const scrolledDown = window.scrollY > 800;
		setIsFixed(!footerVisible && scrolledDown);
	}

	useEffect(() => {
		document.addEventListener("scroll", handleScroll);
		return () => {
			document.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={[styles.backToTop, isFixed === true && styles.fixed].join(" ")}
		>
			<div className="container">
				<a href={`#${scrollTo}`}>
					Back to top (going to scroll to #{scrollTo})
				</a>
			</div>
		</div>
	);
};
