import React, { useMemo } from "react";
import { graphql, PageProps, Link } from "gatsby";

import { AZList, AZListItem } from "@nice-digital/nds-a-z-list";
import { Alphabet, Letter } from "@nice-digital/nds-alphabet";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { ColumnList } from "@nice-digital/nds-column-list";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Topic } from "../types";
import { SEO } from "../components/SEO/SEO";

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

interface TopicLink {
	name: string;
	slug: string;
	isAlias: boolean;
}

export type TopicsPageProps = PageProps<{
	allTopics: {
		nodes: Topic[];
	};
}>;

const TopicsPage: React.FC<TopicsPageProps> = ({ data }: TopicsPageProps) => {
	const { nodes: topics } = data.allTopics;

	const topicsAndAliases = useMemo(() => {
		const directTopicLinks = topics.map(
			({ slug, topicName }) =>
				({ slug, name: topicName, isAlias: false } as TopicLink)
		);

		const topicAliases = topics.reduce(
			(accumulator, currentValue) =>
				accumulator.concat(
					currentValue.aliases.map((alias) => ({
						slug: currentValue.slug,
						name: alias,
						isAlias: true,
					}))
				),
			[] as TopicLink[]
		);

		return directTopicLinks
			.concat(topicAliases)
			.sort((a, b) => a.name.localeCompare(b.name));
	}, [topics]);

	const groupedTopics = useMemo(
		() =>
			alphabet.map((letter) => ({
				letter,
				topics: topicsAndAliases.filter(
					(topicLink) => topicLink.name[0].toLowerCase() === letter
				),
			})),
		[alphabet, topicsAndAliases]
	);

	const lettersWithTopics = useMemo(
		() => groupedTopics.filter(({ topics }) => topics.length > 0),
		[groupedTopics]
	);

	const alphabetComponent = () => (
		<Alphabet aria-label="Letters A to Z">
			{groupedTopics.map(({ letter, topics }) => (
				<Letter key={letter} to={topics.length === 0 ? "" : `#${letter}`}>
					<span className="visually-hidden">Letter </span>
					{letter.trim().toUpperCase()}
					{topics.length === 0 ? (
						<span className="visually-hidden"> (no topics)</span>
					) : null}
				</Letter>
			))}
		</Alphabet>
	);

	return (
		<>
			<SEO title={"Health topics A to Z"} />

			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb>Health topics A to Z</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				id="content-start"
				heading="Health topics A to Z"
				lead="There are over 370 topics, with focus on the most common and significant presentations in primary care."
			/>

			<nav aria-label="Health topics A to Z">
				<AZList
					alphabet={alphabetComponent}
					aria-label="Letters A to Z with matching topics"
				>
					{lettersWithTopics.map(({ letter, topics }) => (
						<AZListItem key={letter} title={letter.toUpperCase()}>
							<ColumnList
								aria-labelledby={letter}
								data-tracking="a-to-z-column-list"
							>
								{topics.map(({ slug, name, isAlias }) => (
									<li key={name}>
										<Link to={`/topics/${slug}/`} data-alias={isAlias}>
											{name}
										</Link>
									</li>
								))}
							</ColumnList>
						</AZListItem>
					))}
				</AZList>
			</nav>

			{/* <Alphabet id="a-to-z" aria-label="Letters A to Z" tabIndex={-1}>
				{groupedTopics.map(({ letter, topics }) => (
					<Letter
						key={`alphabet_${letter}`}
						to={topics.length > 0 && `#${letter}`}
						label={`Letter '${letter.toUpperCase()}'${
							topics.length === 0 ? " (no topics)" : ""
						}`}
					>
						{letter.toUpperCase()}
					</Letter>
				))}
			</Alphabet>

			<nav aria-label="Health topics A to Z">
				<ol
					className={styles.topics}
					aria-label="Letters A to Z with matching topics"
				>
					{lettersWithTopics.map(({ letter, topics }) => (
						<li key={letter} className={styles.letter}>
							<h2
								id={letter}
								className={styles.letterHeading}
								tabIndex={-1}
								aria-label={`Topics starting with '${letter.toUpperCase()}'`}
							>
								{letter.toUpperCase()}
							</h2>
							<ColumnList aria-labelledby={letter}>
								{topics.map(({ slug, name, isAlias }) => (
									<li key={name}>
										<Link to={`/topics/${slug}/`} data-alias={isAlias}>
											{name}
										</Link>
									</li>
								))}
							</ColumnList>
						</li>
					))}
				</ol>
			</nav> */}
		</>
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
