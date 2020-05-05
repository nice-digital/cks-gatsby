import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";
import { Speciality } from "../types";

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
	<div>
		<h1>Specialities</h1>
		<ul>
			{data.allSpecialities.nodes.map(({ id, slug, name }) => (
				<li key={id}>
					<Link to={slug}>{name}</Link>
				</li>
			))}
		</ul>
	</div>
);

export const query = graphql`
	{
		allSpecialities: allCksSpeciality {
			nodes {
				id
				name
				slug
			}
		}
	}
`;

export default SpecialitiesPage;
