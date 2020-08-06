import React, { ReactNode } from "react";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { BackToTop } from "../BackToTop/BackToTop";

import "./Layout.scss";
import styles from "../BackToTop/BackToTop.module.scss";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<Header />
			<main className="container" id="content-start">
				<div className={styles.backToTopSpacing}>{children}</div>
			</main>
			<BackToTop />
			<Footer />
		</>
	);
};
