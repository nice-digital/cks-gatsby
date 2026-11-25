import React, { ReactNode } from "react";
import { Container } from "@nice-digital/nds-container";

import { SiteHeader } from "../SiteHeader/SiteHeader";
import { EULABanner } from "../EULABanner/EULABanner";
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
			<EULABanner />
			<SiteHeader />
			<Main>
				<Container>
					{children}

					<Panel className={styles.eula} data-testid="eula">
						<p>
							Clinical Knowledge Summaries (CKS) support evidence-based decision
							making in primary care through concise summaries that draw on NICE
							guidance and other high-quality evidence sources.{" "}
							<a href="https://cks.nice.org.uk/about/">Learn more about CKS</a>.
						</p>
						<p>
							CKS is commissioned by NICE and developed by{" "}
							<a
								href="https://agiliosoftware.com/primary-care/"
								rel="noopener noreferrer"
							>
								Agilio Software
							</a>
							. By using CKS, you agree to the{" "}
							<a href="https://www.nice.org.uk/cks-end-user-licence-agreement">
								CKS End User Licence Agreement (EULA)
							</a>
							. Content © Clarity Informatics Limited (trading as{" "}
							<a
								href="https://agiliosoftware.com/primary-care/"
								rel="noopener noreferrer"
							>
								Agilio Software
							</a>
							).
						</p>
					</Panel>
				</Container>
			</Main>
			<Footer service="cks" />
		</>
	);
};
