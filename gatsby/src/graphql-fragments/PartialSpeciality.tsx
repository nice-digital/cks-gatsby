import { graphql } from "gatsby";

export const PartialSpeciality = graphql`
	fragment PartialSpeciality on CksSpeciality {
		id
		name
		slug
	}
`;
