import React, { ReactNode } from "react";
import { Container } from "@nice-digital/nds-container";

import { SiteHeader } from "../SiteHeader/SiteHeader";
import { Footer, Main } from "@nice-digital/global-nav";
import { Panel } from "@nice-digital/nds-panel";

import "./../../styles/global.scss";

import styles from "./Layout.module.scss";

type LayoutProps = {
	children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }: LayoutProps) => {
	return (
		<>
			<SiteHeader />
			<Main>
				<Container>
					{children}

					<Panel className={styles.eula} data-testid="eula">
						<p>
							The content on the NICE Clinical Knowledge Summaries site (CKS) is
							the copyright of{" "}
							<a
								href="https://agiliosoftware.com/primary-care/"
								rel="noopener noreferrer"
							>
								Clarity Informatics Limited (trading as Agilio Software Primary
								Care)
							</a>
							. By using CKS, you agree to the licence set out in the{" "}
							<a href="https://www.nice.org.uk/terms-and-conditions/cks-end-user-licence-agreement">
								CKS End User Licence Agreement
							</a>
							.
						</p>
					</Panel>
				</Container>
			</Main>
			<Footer service="cks" />
		</>
	);
};
