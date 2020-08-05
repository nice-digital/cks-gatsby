import React, { ReactNode } from "react";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import { BackToTop } from "../BackToTop/BackToTop";

import "./Layout.scss";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<Header />
			<main className="container" id="content-start">
				{children}
			</main>
			<BackToTop />
			<Footer />
		</>
	);
};
