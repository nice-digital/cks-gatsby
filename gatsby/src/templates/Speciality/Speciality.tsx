import React from "react";
import { graphql, PageRendererProps, Link } from "gatsby";

import { Layout } from "../../components/Layout/Layout";
import { Speciality } from "../../types";
import { SEO } from "../../components/SEO/SEO";

type SpecialityPageProps = {
	data: {
		speciality: Speciality;
	};
} & PageRendererProps;

const SpecialityPage: React.FC<SpecialityPageProps> = ({
	data: {
		speciality: { name, topics },
	},
}: SpecialityPageProps) => {
	return (
		<Layout>
			<SEO title={name + " | Specialities"} />
			<h1>Speciality: {name}</h1>
			Topics:
			<ul>
				{topics.map(({ id, topicName, slug }) => (
					<li key={id}>
						<Link to={slug}>{topicName}</Link>
					</li>
				))}
			</ul>
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
