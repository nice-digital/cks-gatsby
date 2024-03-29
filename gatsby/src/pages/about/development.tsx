import React from "react";
import { Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";
import { Button } from "@nice-digital/nds-button";

import { SEO } from "../../components/SEO/SEO";
import { HelpPanel } from "../../components/HelpPanel/HelpPanel";

import styles from "./about.module.scss";

const DevelopmentPage: React.FC = () => {
	return (
		<>
			<SEO
				title={`Development process | About CKS`}
				description={`The CKS development process, including new topics, topic updates and the CKS process guide`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb to="/about/" elementType={Link}>
					About CKS
				</Breadcrumb>
				<Breadcrumb>Development process</Breadcrumb>
			</Breadcrumbs>

			<PageHeader id="content-start" heading="Development process" />

			<Grid gutter="loose">
				<GridItem cols={12} md={7} lg={8} className={styles.body}>
					<h2>New topics</h2>
					<p>
						The topic development panel take into account the following when
						developing new topics:
					</p>
					<ul aria-label="What's taken into account when developing new topics">
						<li>enquiries sent to NICE CKS</li>
						<li>GP curriculum</li>
						<li>new NICE clinical guidelines</li>
						<li>
							new pressures affecting primary care as highlighted by the
							Department of Health and Public Health England.
						</li>
					</ul>
					<p>Up to 10 new CKS topics are produced each year.</p>

					<h2>Updates</h2>
					<p>
						Topics are fully reviewed and updated every 5 years. We will update
						a topic sooner if significant new evidence emerges such as:
					</p>
					<ul aria-label="Reasons for updating a topic sooner">
						<li>publication of new/updated NICE guidance</li>
						<li>new updated national polices or safety information</li>
						<li>changes to products licenses and device availability</li>
						<li>other important new evidence.</li>
					</ul>
					<p>65+ CKS updates are produced each year.</p>

					<h2>Topic development</h2>
					<p>
						CKS topics are developed for NICE by Clarity Informatics Ltd using{" "}
						<a href="https://www.nice.org.uk/about/what-we-do/accreditation">
							an accredited development process
						</a>
						.
					</p>
					<p>
						Topics are developed and reviewed by a multidisciplinary team
						consisting of:
					</p>
					<ul aria-label="Roles that develop and review topics">
						<li>clinicians</li>
						<li>pharmacists</li>
						<li>pharmacologists</li>
						<li>information specialists</li>
						<li>informatics analysts</li>
						<li>technical authors.</li>
					</ul>
					<p>
						The process used to develop and review CKS topics includes the
						following:
					</p>
					<ul aria-label="Stages to develop and review CKS topics">
						<li>topic development and selection</li>
						<li>scoping</li>
						<li>developing clinical questions and scenarios</li>
						<li>literature searching</li>
						<li>evaluating and summarising the evidence</li>
						<li>developing clinical recommendations</li>
						<li>external consultation</li>
						<li>release.</li>
					</ul>

					<h3>Evidence-based</h3>
					<p>
						CKS topics are developed and updated using the best available
						evidence. High-quality secondary evidence from NICE accredited
						resources (for example, NICE guidance and Cochrane systematic
						reviews) is identified first, and primary research and expert
						opinion sought where necessary.
					</p>

					<h3>Relevant information</h3>
					<p>
						The development process has a number of checks to make sure that the
						information is relevant and appropriate to primary care
						professionals:
					</p>
					<ul aria-label="CKS process checks for relevant information">
						<li>thorough scoping and review process</li>
						<li>
							input from healthcare professionals with primary care experience
						</li>
						<li>consultation with GPs, pharmacists, lay members</li>
						<li>feedback received from external reviews.</li>
					</ul>
					<p>
						More detailed information on the way CKS topics are developed can be
						found in the{" "}
						<a href="https://www.nice.org.uk/media/default/About/what-we-do/Evidence%20Services/CKS/CKS-guide.pdf">
							CKS process guide (PDF, 400 KB)
						</a>
						.
					</p>
					<p>
						<Button
							variant="secondary"
							to="https://agiliosoftware.com/primary-care/prodigy/"
							download
						>
							Help develop CKS topics
						</Button>
					</p>
				</GridItem>
				<GridItem cols={12} md={5} lg={4}>
					<Panel>
						<h2 className="h3">CKS process guide</h2>
						<p>Detailed information on the CKS development process:</p>
						<p>
							<Button
								variant="secondary"
								to="https://www.nice.org.uk/media/default/About/what-we-do/Evidence%20Services/CKS/CKS-guide.pdf"
								download
							>
								CKS process guide (PDF, 400 KB)
							</Button>
						</p>
					</Panel>
					<HelpPanel />
				</GridItem>
			</Grid>
		</>
	);
};

export default DevelopmentPage;
