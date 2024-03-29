import React, { useMemo } from "react";
import { graphql, PageProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { ColumnList } from "@nice-digital/nds-column-list";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Speciality } from "../../types";
import { SEO } from "../../components/SEO/SEO";

export type SpecialityPageProps = PageProps<
	{
		speciality: Speciality;
	},
	{ id: string }
>;

const SpecialityPage: React.FC<SpecialityPageProps> = ({
	data: {
		speciality: { name, topics },
	},
}: SpecialityPageProps) => {
	const orderedTopics = useMemo(
		() => topics.sort((a, b) => a.topicName.localeCompare(b.topicName)),
		[topics]
	);

	const metaDescription = useMemo(
		() =>
			[
				"Speciality ",
				name.charAt(0).toLowerCase() + name.slice(1),
				", containing practical advice on best practice for ",
				topics.length,
				" primary care topic",
				topics.length > 1 ? "s" : "",
			].join(""),
		[name, topics]
	);

	return (
		<>
			<SEO title={name + " | Specialities"} description={metaDescription} />

			<Breadcrumbs>
				<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
				<Breadcrumb to="/" elementType={Link}>
					CKS
				</Breadcrumb>
				<Breadcrumb to="/specialities/" elementType={Link}>
					Specialities
				</Breadcrumb>
				<Breadcrumb>{name}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader id="content-start" heading={name} />

			<ColumnList aria-label={`A to Z of topics within ${name}`}>
				{orderedTopics.map(({ id, topicName, slug }) => (
					<li key={id}>
						<Link to={`/topics/${slug}/`}>{topicName}</Link>
					</li>
				))}
			</ColumnList>
		</>
	);
};

export default SpecialityPage;

export const SpecialityPageQuery = graphql`
	query SpecialityById($id: String!) {
		speciality: cksSpeciality(id: { eq: $id }) {
			...FullSpeciality
		}
	}
`;
