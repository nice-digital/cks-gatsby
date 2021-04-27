import React, { ReactNode } from "react";
import { Container } from "@nice-digital/nds-container";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { BackToTop } from "../BackToTop/BackToTop";

import "./../../styles/global.scss";
import styles from "./Layout.module.scss";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<Header />
			<main className={styles.main} id="content-start">
				<Container>{children}</Container>
				<BackToTop />
			</main>
			<Footer />
		</>
	);
};
