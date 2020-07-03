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
import topicStyles from "./topics.module.scss";

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
					<h2>Health topics A to Z</h2>

					<p>
						There are over 350 topics, with focus on the most common and
						significant presentations in primary care.
					</p>

					<ol
						aria-label="Letters A to Z"
						className={topicStyles.alphabet}
						tabIndex={-1}
					>
						{allTopicButtons.map(({ letter, linkable }) => (
							<li key={`alphabet_${letter}`}>
								{linkable ? (
									<Link
										to={`/topics/#${letter}`}
										aria-label={`Letter '${letter.toUpperCase()}'`}
									>
										{letter.toUpperCase()}
									</Link>
								) : (
									<span>{letter.toUpperCase()}</span>
								)}
							</li>
						))}
					</ol>

					<h3>Frequently visited topics</h3>
					<ColumnList plain>
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
					<h2>Specialities</h2>

					<ColumnList plain>
						{specialitiesNodes.map(({ id, name, slug }) => (
							<li key={id}>
								<Link to={`/specialities/${slug}`}>{name}</Link>
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
