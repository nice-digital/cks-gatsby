import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";
import { PartialSpeciality } from "../types";
import { Layout } from "../components/Layout/Layout";
import { SEO } from "../components/SEO/SEO";

type SpecialitiesPageProps = {
	data: {
		allSpecialities: {
			nodes: PartialSpeciality[];
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
					<Link to={`/specialities/${slug}/`}>{name}</Link>
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
