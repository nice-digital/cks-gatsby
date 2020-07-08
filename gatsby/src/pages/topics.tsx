import React, { useMemo } from "react";
import { graphql, PageProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Topic } from "../types";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { ColumnList } from "../components/ColumnList/ColumnList";
import { Alphabet, Letter } from "../components/Alphabet/Alphabet";

import styles from "./topics.module.scss";

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

export type TopicsPageProps = PageProps<{
	allTopics: {
		nodes: Topic[];
	};
}>;

const TopicsPage: React.FC<TopicsPageProps> = ({ data }: TopicsPageProps) => {
	const { nodes: topics } = data.allTopics;

	const groupedTopics = useMemo(
		() =>
			alphabet.map(letter => ({
				letter,
				topics: topics.filter(
					topic => topic.topicName[0].toLowerCase() === letter
				),
			})),
		[alphabet, topics]
	);

	const lettersWithTopics = useMemo(
		() => groupedTopics.filter(({ topics }) => topics.length > 0),
		[groupedTopics]
	);

	return (
		<Layout>
			<SEO title={"Topics A to Z"} />

			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb>Topics A to Z</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading="Topics A to Z"
				lead="There are over 350 topics, with focus on the most common and significant presentations in primary care."
			/>

			<Alphabet id="a-to-z" aria-label="Letters A to Z" tabIndex={-1}>
				{groupedTopics.map(({ letter, topics }) => (
					<Letter
						key={`alphabet_${letter}`}
						to={topics.length > 0 && `#${letter}`}
						aria-label={`Letter '${letter.toUpperCase()}${
							topics.length > 0 ? " (no topics)" : ""
						}'`}
					>
						{letter.toUpperCase()}
					</Letter>
				))}
			</Alphabet>

			<nav aria-label="Topics A to Z">
				<ol
					className={styles.topics}
					aria-label="Letters A to Z with matching topics"
				>
					{lettersWithTopics.map(({ letter, topics }) => (
						<li key={letter}>
							<h2
								id={letter}
								className={styles.letterHeading}
								tabIndex={-1}
								aria-label={`Topics starting with '${letter.toUpperCase()}'`}
							>
								{letter.toUpperCase()}
							</h2>
							<ColumnList aria-labelledby={letter}>
								{topics.map(({ id, slug, topicName }) => (
									<li key={id}>
										<Link to={`/topics/${slug}/`}>{topicName}</Link>
									</li>
								))}
							</ColumnList>

							<a href="#a-to-z" className={styles.backToTop}>
								Back to top (A to Z)
							</a>
						</li>
					))}
				</ol>
			</nav>
		</Layout>
	);
};

export const query = graphql`
	{
		allTopics: allCksTopic(sort: { fields: slug, order: ASC }) {
			nodes {
				...PartialTopic
			}
		}
	}
`;

export default TopicsPage;
