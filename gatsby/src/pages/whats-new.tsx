import React, { useMemo } from "react";
import { Link, PageProps, graphql } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";
import { Card } from "@nice-digital/nds-card";
import { Tag } from "@nice-digital/nds-tag";
import { Button } from "@nice-digital/nds-button";

import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { WhatsNewChange } from "src/types";

export type WhatsNewPageProps = PageProps<{
	allCksChange: {
		nodes: WhatsNewChange[];
	};
	site: {
		siteMetadata: {
			changesSinceDateISO: string;
			changesSinceDateFormatted: string;
		};
	};
}>;

const isNewTopic = ({ title }: WhatsNewChange): boolean =>
	title.toLowerCase().indexOf("new") > -1;

const WhatsNewPage: React.FC<WhatsNewPageProps> = ({
	data: { site, allCksChange },
}: WhatsNewPageProps) => {
	const { changesSinceDateISO, changesSinceDateFormatted } = site.siteMetadata;

	const numNewTopics = useMemo(
		() => allCksChange.nodes.filter(isNewTopic).length,
		[allCksChange.nodes]
	);

	const numUpdatedTopics = allCksChange.nodes.length - numNewTopics;

	return (
		<Layout>
			<SEO
				title={`${changesSinceDateFormatted} | What's new`}
				description={`Topic updates for CKS for ${changesSinceDateFormatted}`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb>What&apos;s new</Breadcrumb>
			</Breadcrumbs>
			<PageHeader
				heading={
					<>
						What&apos;s new for{" "}
						<time dateTime={changesSinceDateISO}>
							{changesSinceDateFormatted}
						</time>
					</>
				}
				lead={
					<>
						{numNewTopics > 0 && (
							<>
								{numNewTopics} new topic{numNewTopics > 1 && "s"}
							</>
						)}
						{numNewTopics > 0 && numUpdatedTopics > 0 && " and "}
						{numUpdatedTopics > 0 && (
							<>
								{numUpdatedTopics} updated topic{numUpdatedTopics > 1 && "s"}
							</>
						)}{" "}
						for{" "}
						<time dateTime={changesSinceDateISO}>
							{changesSinceDateFormatted}
						</time>
					</>
				}
			/>
			<Grid gutter="loose">
				<GridItem cols={12} md={7} lg={8}>
					<h2 className="visually-hidden" id="topic-updates">
						Topic updates
					</h2>
					<ul
						className="list--unstyled"
						style={{ margin: 0 }}
						aria-labelledby="topic-updates"
					>
						{allCksChange.nodes.map(change => {
							const { id, text, title, topic } = change,
								isNew = isNewTopic(change);

							return (
								<li key={id}>
									<Card
										elementType="article"
										headingText={topic.topicName}
										headingElementType="h3"
										link={{
											elementType: Link,
											destination: `/topics/${topic.slug}/`,
										}}
										summary={text}
										metadata={[
											{
												label: "Type",
												value: (
													<Tag isNew={isNew} updated={!isNew}>
														{title}
													</Tag>
												),
											},
										]}
									/>
								</li>
							);
						})}
					</ul>
				</GridItem>
				<GridItem cols={12} md={5} lg={4} className="mt--e mt--0-md">
					<Panel>
						<h2 className="h3">CKS development process</h2>
						<p>
							Up to 10 new CKS topics and more than 65 updates are produced each
							year.
						</p>
						<p>
							Topics are fully reviewed and updated every 5 years and we will
							update a topic sooner if significant new evidence emerges.
						</p>
						<p>
							<Button
								to="/about/development/"
								elementType={Link}
								variant="secondary"
							>
								CKS development process
							</Button>
						</p>
					</Panel>
				</GridItem>
			</Grid>
		</Layout>
	);
};

export const query = graphql`
	{
		allCksChange(sort: { fields: topic___topicName }) {
			nodes {
				...WhatsNewChange
			}
		}
		site {
			siteMetadata {
				changesSinceDateISO: changesSinceDate(formatString: "YYYY-MM")
				changesSinceDateFormatted: changesSinceDate(formatString: "MMMM YYYY")
			}
		}
	}
`;

export default WhatsNewPage;
