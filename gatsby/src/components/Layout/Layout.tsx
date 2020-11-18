import React, { ReactNode } from "react";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { BackToTop } from "../BackToTop/BackToTop";

import "./Layout.scss";
import styles from "../BackToTop/BackToTop.module.scss";
import { Helmet } from "react-helmet";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<Helmet>
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="crossOrigin"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap"
				/>
				<script
					src="https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js"
					type="text/javascript"
				></script>
			</Helmet>
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
