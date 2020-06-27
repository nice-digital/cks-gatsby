import React from "react";
import { graphql, PageProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { Layout } from "../../components/Layout/Layout";
import { Speciality } from "../../types";
import { SEO } from "../../components/SEO/SEO";
import { ColumnList } from "../../components/ColumnList/ColumnList";

type SpecialityPageProps = PageProps<
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
	return (
		<Layout>
			<SEO title={name + " | Specialities"} />

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

			<PageHeader heading={name} />

			<ColumnList aria-label={`A to Z of topics within ${name}`}>
				{topics.map(({ id, topicName, slug }) => (
					<li key={id}>
						<Link to={`/topics/${slug}/`}>{topicName}</Link>
					</li>
				))}
			</ColumnList>
		</Layout>
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
