import React, { ReactNode } from "react";

import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<Header />
			<main className="container">{children}</main>
			<Footer />
		</>
	);
};
