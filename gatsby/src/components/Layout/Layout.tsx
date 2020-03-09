import React, { ReactNode } from "react";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<main className="container">{children}</main>
		</>
	);
};
