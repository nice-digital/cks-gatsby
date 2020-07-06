import React from "react";
import { Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { HelpPanel } from "../../components/HelpPanel/HelpPanel";
import { Layout } from "../../components/Layout/Layout";
import { SEO } from "../../components/SEO/SEO";

import styles from "./about.module.scss";

const AboutPage: React.FC = () => {
	return (
		<Layout>
			<SEO
				title={`About CKS`}
				description={`Clinical Knowledge Summaries are concise, accessible summaries of current evidence for primary care professionals. There are over 350 topics to chose from.`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb>About CKS</Breadcrumb>
			</Breadcrumbs>

			<PageHeader heading="About CKS" />

			<Grid gutter="loose">
				<GridItem cols={12} md={7} lg={8} className={styles.body}>
					<h2>Quick answers to clinical questions</h2>
					<p>
						Clinical Knowledge Summaries are concise, accessible summaries of
						current evidence for primary care professionals. There are over 350
						topics to chose from.
					</p>
					<p>
						The topics focus on the most common and significant presentations in
						primary care. They give trusted information to support safe
						decision-making and improve standards of patient care.{" "}
					</p>
					<h2>Developed on behalf of NICE</h2>
					<p>
						CKS topics are developed by Clarity Informatics Ltd but commissioned
						and funded by NICE.
					</p>
					<p>
						Topics are written by an expert multidisciplinary team with
						experience of primary care, supported by a network of over 6000
						specialist external reviewers.
					</p>
					<p>
						The development process is{" "}
						<a href="https://www.nice.org.uk/about/what-we-do/accreditation">
							accredited by NICE
						</a>{" "}
						to ensure the highest quality.
					</p>
					<p>
						<Link to="/about/development/">
							Read more about the CKS development process
						</Link>
					</p>
					<h2>Evidence-based</h2>
					<p>
						CKS topics are developed and updated using the best available
						evidence. High-quality secondary evidence from NICE accredited
						resources - like NICE guidance and Cochrane systematic reviews - is
						identified first. Primary research and expert opinion is sought
						where necessary.
					</p>
					<h2>Designed for primary care professionals</h2>
					<p>
						CKS topics have been designed to support healthcare professionals in
						primary care:
					</p>
					<ul aria-label="Primary care audience for CKS">
						<li>GPs</li>
						<li>GP registrars</li>
						<li>nurses</li>
						<li>pharmacists</li>
						<li>healthcare librarians</li>
						<li>medical, nursing and pharmacy students.</li>
					</ul>
					<p>
						Information is presented as specific clinical questions with answers
						and links to supporting evidence.
					</p>
					<h2>Always up-to-date</h2>
					<p>
						CKS content is continually reviewed and updated to ensure it is
						relevant and accurate. 65+ updates and up to 10 new topics are
						produced each year.
					</p>
				</GridItem>
				<GridItem cols={12} md={5} lg={4}>
					<HelpPanel />
				</GridItem>
			</Grid>
		</Layout>
	);
};

export default AboutPage;
