import React from "react";
import { graphql, Link } from "gatsby";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Button } from "@nice-digital/nds-button";

import { Layout } from "../components/Layout/Layout";
import { PartialTopic } from "../types";
import { SEO } from "../components/SEO/SEO";

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
			<SEO />
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
			<p>
				{"abcdefghijklmnoprstuvw".split("").map(letter => (
					<Link key={letter} to={`/topics/#${letter}`}>
						{letter}&nbsp;
					</Link>
				))}
			</p>
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
