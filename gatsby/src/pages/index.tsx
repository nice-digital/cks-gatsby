import React from "react";
import { graphql, Link } from "gatsby";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Button } from "@nice-digital/nds-button";

import { Layout } from "../components/Layout/Layout";
import { PartialTopic } from "../types";
import { SEO } from "../components/SEO/SEO";
import { Helmet } from "react-helmet";

type IndexProps = {
	data: {
		allTopics: {
			nodes: PartialTopic[];
		};
	};
};

const IndexPage: React.FC<IndexProps> = ({
	data: { allTopics },
}: IndexProps) => {
	return (
		<Layout>
			<SEO
				additionalMetadata={
					//we pass in a react helmet component here as due to this bug https://github.com/nfl/react-helmet/issues/342
					<Helmet>
						<meta
							name="google-site-verification"
							content="3N3Ng_4D9vTfn0AubNl1BjDivNeDmo_erefsd_ClwL4"
						/>
					</Helmet>
				}
			/>
			<Hero
				title="Clinical Knowledge Summaries"
				intro="Providing primary care practitioners with a readily accessible summary of the current evidence base and practical guidance on best&nbsp;practice"
				actions={
					<>
						<Button to="/topics/" variant="cta" elementType={Link}>
							Topics A to Z
						</Button>
						<Button to="/specialities/" elementType={Link}>
							Specialities
						</Button>
					</>
				}
				header={
					<Breadcrumbs>
						<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
						<Breadcrumb>CKS</Breadcrumb>
					</Breadcrumbs>
				}
			>
				<h2 className="h4 mt--0-md">Most viewed topics</h2>
				<ul className="list--unstyled list--loose">
					<li>
						<Link to="/topics/lyme-disease/">Lyme disease</Link>
					</li>
					<li>
						<Link to="/topics/hypertension-not-diabetic/">
							Hypertension - not diabetic
						</Link>
					</li>
					<li>
						<Link to="/topics/diabetes-type-2/">Diabetes - type 2</Link>
					</li>
					<li>
						<Link to="/topics/gout/">Gout</Link>
					</li>
					<li>
						<Link to="/topics/menopause/">Menopause</Link>
					</li>
				</ul>
			</Hero>

			<h2>Topics</h2>
			<p>TODO: Show A-Z of all {allTopics.nodes.length} topics</p>
		</Layout>
	);
};

export default IndexPage;

export const IndexPageQuery = graphql`
	{
		allTopics: allCksTopic {
			nodes {
				...PartialTopic
			}
		}
	}
`;
