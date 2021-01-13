import React, { ReactNode } from "react";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { BackToTop } from "../BackToTop/BackToTop";
import { Lato } from "../Lato/Lato";

import "./Layout.scss";
import styles from "../BackToTop/BackToTop.module.scss";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<Lato />
			<Header />
			<main
				className={`container ${styles.backToTopSpacing}`}
				id="content-start"
			>
				{children}
			</main>
			<BackToTop />
			<Footer />
		</>
	);
};
