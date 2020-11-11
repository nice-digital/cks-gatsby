import React from "react";
import { graphql, PageProps, Link } from "gatsby";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { PartialSpeciality } from "../types";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";
import { ColumnList } from "../components/ColumnList/ColumnList";

export type SpecialitiesPageProps = PageProps<{
	allSpecialities: {
		nodes: PartialSpeciality[];
	};
}>;

const SpecialitiesPage: React.FC<SpecialitiesPageProps> = ({
	data: {
		allSpecialities: { nodes },
	},
}: SpecialitiesPageProps) => (
	<Layout>
		<SEO title="Specialities" />

		<Breadcrumbs>
			<Breadcrumb to="https://www.nice.org.uk/">NICE</Breadcrumb>
			<Breadcrumb to="/" elementType={Link}>
				CKS
			</Breadcrumb>
			<Breadcrumb>Specialities</Breadcrumb>
		</Breadcrumbs>

		<PageHeader
			heading="Specialities"
			lead="There are over 370 topics, with focus on the most common and significant presentations in primary care."
		/>

		<ColumnList aria-label="A to Z of specialities">
			{nodes.map(({ id, slug, name }) => (
				<li key={id}>
					<Link to={`/specialities/${slug}/`}>{name}</Link>
				</li>
			))}
		</ColumnList>
	</Layout>
);

export const query = graphql`
	{
		allSpecialities: allCksSpeciality(sort: { fields: name }) {
			nodes {
				...PartialSpeciality
			}
		}
	}
`;

export default SpecialitiesPage;
