import { graphql } from "gatsby";

export const PartialSpeciality = graphql`
	fragment PartialSpeciality on CksSpeciality {
		id
		name
		slug
	}
`;

export const FullSpeciality = graphql`
	fragment FullSpeciality on CksSpeciality {
		...PartialSpeciality
		topics {
			...PartialTopic
		}
	}
`;
