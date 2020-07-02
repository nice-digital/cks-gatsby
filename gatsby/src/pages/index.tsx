import React from "react";
import { graphql, Link } from "gatsby";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";
import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { Layout } from "../components/Layout/Layout";
import { PartialSpeciality } from "../types";
import { SEO } from "../components/SEO/SEO";
import { ColumnList } from "../components/ColumnList/ColumnList";

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

			<Grid gutter="loose">
				<GridItem md={6} cols={12}>
					<h2>Health topics A to Z</h2>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae
						quaerat eaque ipsam non illo unde voluptate praesentium consequuntur
						expedita reprehenderit?
					</p>

					<div>
						{allTopicButtons.map(({ letter, linkable }) => (
							<Link key={letter} to={linkable ? `/topics#${letter}` : ""}>
								{letter}
							</Link>
						))}
					</div>

					<h3>Frequently visited topics</h3>
					<ColumnList plain>
						<li>
							<a href="#">Frequent 1</a>
						</li>
						<li>
							<a href="#">Frequent 2</a>
						</li>
						<li>
							<a href="#">Frequent 3</a>
						</li>
						<li>
							<a href="#">Frequent 4</a>
						</li>
						<li>
							<a href="#">Frequent 5</a>
						</li>
						<li>
							<a href="#">Frequent 6</a>
						</li>
					</ColumnList>
				</GridItem>
				<GridItem md={6} cols={12}>
					<h2>Specialities</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. A veritatis
						porro quos facere asperiores voluptate sed maxime expedita ratione.
						Reiciendis.
					</p>
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
