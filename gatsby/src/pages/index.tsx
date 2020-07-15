import React from "react";
import { graphql, Link } from "gatsby";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { Layout } from "../components/Layout/Layout";
import { PartialSpeciality } from "../types";
import { SEO } from "../components/SEO/SEO";
import { ColumnList } from "../components/ColumnList/ColumnList";

import styles from "./index.module.scss";
import { Alphabet, Letter } from "../components/Alphabet/Alphabet";

type IndexProps = {
	data: {
		allSpecialities: {
			nodes: PartialSpeciality[];
		};
		allCksTopic: {
			distinct: string[];
		};
	};
};

const alphabet = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z",
];

const IndexPage: React.FC<IndexProps> = ({
	data: {
		allSpecialities: { nodes: specialitiesNodes },
		allCksTopic: { distinct: topicNames },
	},
}: IndexProps) => {
	const linkableLetters = Array.from(
		new Set(topicNames.map(topicName => topicName.charAt(0).toLowerCase()))
	);

	const allTopicButtons = alphabet.map(letter => {
		return {
			letter,
			linkable: linkableLetters.includes(letter),
		};
	});

	return (
		<Layout>
			<SEO />
			<Hero
				title="Clinical Knowledge Summaries"
				intro="Providing primary care practitioners with a readily accessible summary of the current evidence base and practical guidance on best&nbsp;practice"
				header={
					<Breadcrumbs>
						<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
						<Breadcrumb>CKS</Breadcrumb>
					</Breadcrumbs>
				}
			/>

			<Grid gutter="none">
				<GridItem md={6} cols={12} className={styles.topicsColumn}>
					<h2 id="topics-a-to-z">Health topics A to Z</h2>
					<p id="topics-a-to-z-desc">
						Over 350 topics organised alphabetically, with focus on the most
						common and significant presentations in primary&nbsp;care.
					</p>

					<Alphabet
						chunky
						aria-labelledby="topics-a-to-z"
						aria-describedby="topics-a-to-z-desc"
					>
						{allTopicButtons.map(({ letter, linkable }) => (
							<Letter
								key={`alphabet_${letter}`}
								to={linkable && `/topics/#${letter}`}
							>
								{letter.toUpperCase()}
							</Letter>
						))}
					</Alphabet>

					<h3 id="frequently-visited-topics">Frequently visited topics</h3>
					<ColumnList plain aria-labelledby="frequently-visited-topics">
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
						<li className={styles.showAtMD}>
							<Link to="/topics/migraine/">Migraine</Link>
						</li>
						<li className={styles.showAtMD}>
							<Link to="/topics/allergic-rhinitis/">Allergic rhinitis</Link>
						</li>
						<li className={styles.showAtMD}>
							<Link to="/topics/asthma/">Asthma</Link>
						</li>
					</ColumnList>
				</GridItem>

				<GridItem md={6} cols={12} className={styles.specialitiesColumn}>
					<h2 id="specialties">Specialties</h2>

					<p>Our knowledge summaries grouped by&nbsp;specialty.</p>

					<ColumnList plain aria-labelledby="specialties">
						{specialitiesNodes.map(({ id, name, slug }) => (
							<li key={id}>
								<Link to={`/specialities/${slug}/`}>{name}</Link>
							</li>
						))}
					</ColumnList>
				</GridItem>
			</Grid>
		</Layout>
	);
};

export default IndexPage;

export const query = graphql`
	{
		allSpecialities: allCksSpeciality(sort: { fields: name }) {
			nodes {
				...PartialSpeciality
			}
		}
		allCksTopic {
			distinct(field: topicName)
		}
	}
`;
