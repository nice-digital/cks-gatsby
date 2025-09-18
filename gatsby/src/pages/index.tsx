import React, { useMemo } from "react";
import { graphql, Link } from "gatsby";
import { Alphabet, Letter } from "@nice-digital/nds-alphabet";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { ColumnList } from "@nice-digital/nds-column-list";
import { Hero } from "@nice-digital/nds-hero";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { PartialSpeciality } from "../types";
import { SEO } from "../components/SEO/SEO";

import styles from "./index.module.scss";

type IndexProps = {
	data: {
		allSpecialities: {
			nodes: PartialSpeciality[];
		};
		allTopicNames: {
			distinct: string[];
		};
		allTopicNameAliases: {
			distinct: string[];
		};
	};
};

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

const IndexPage: React.FC<IndexProps> = ({
	data: {
		allSpecialities: { nodes: specialitiesNodes },
		allTopicNames: { distinct: topicNames },
		allTopicNameAliases: { distinct: topicNameAliases },
	},
}: IndexProps) => {
	const linkableLetters = useMemo(
		() =>
			new Set(
				[...topicNames, ...topicNameAliases].map((name) =>
					name[0].toLowerCase()
				)
			),
		[topicNames, topicNameAliases]
	);

	return (
		<>
			<SEO />
			<Hero
				title="Clinical Knowledge Summaries"
				intro="Providing primary care practitioners with a readily accessible summary of the current evidence base and practical advice on best&nbsp;practice"
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
						Over 370 topics organised alphabetically, with focus on the most
						common and significant presentations in primary&nbsp;care.
					</p>

					<Alphabet
						chunky
						aria-labelledby="topics-a-to-z"
						aria-describedby="topics-a-to-z-desc"
						data-tracking="topics-a-to-z"
					>
						{alphabet.map((letter) => (
							<Letter
								key={`alphabet_${letter}`}
								elementType={Link}
								to={linkableLetters.has(letter) && `/topics/#${letter}`}
							>
								<span className="visually-hidden">
									Browse topics by the letter{" "}
								</span>
								{letter.toUpperCase()}
							</Letter>
						))}
					</Alphabet>

					<h3 id="frequently-visited-topics">
						Topics most frequently visited by other&nbsp;users
					</h3>
					<ColumnList
						plain
						columns={2}
						aria-labelledby="frequently-visited-topics"
						data-tracking="frequently-visited-topics"
					>
						<li>
							<Link to="/topics/hypertension/">Hypertension</Link>
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
					<h2 id="specialities">Specialities</h2>

					<p>Our topics grouped by&nbsp;speciality.</p>

					<ColumnList
						plain
						columns={2}
						aria-labelledby="specialities"
						data-tracking="specialities"
					>
						{specialitiesNodes.map(({ id, name, slug }) => (
							<li key={id}>
								<Link to={`/specialities/${slug}/`}>{name}</Link>
							</li>
						))}
					</ColumnList>
				</GridItem>
			</Grid>
		</>
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
		allTopicNames: allCksTopic {
			distinct(field: topicName)
		}
		allTopicNameAliases: allCksTopic {
			# GraphQL flattens this array of arrays for us
			distinct(field: aliases)
		}
	}
`;
