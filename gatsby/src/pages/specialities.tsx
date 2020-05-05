import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";
import { Speciality } from "../types";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

type SpecialitiesPageProps = {
	data: {
		allSpecialities: {
			nodes: Speciality[];
		};
	};
} & PageRendererProps;

const SpecialitiesPage: React.FC<SpecialitiesPageProps> = ({
	data,
}: SpecialitiesPageProps) => (
	<Layout>
		<SEO title={"Specialities"} />
		<h1>Specialities</h1>
		<ul>
			{data.allSpecialities.nodes.map(({ id, slug, name }) => (
				<li key={id}>
					<Link to={slug}>{name}</Link>
				</li>
			))}
		</ul>
	</Layout>
);

export const query = graphql`
	{
		allSpecialities: allCksSpeciality {
			nodes {
				...PartialSpeciality
			}
		}
	}
`;

export default SpecialitiesPage;
