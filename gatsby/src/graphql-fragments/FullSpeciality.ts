import { graphql } from "gatsby";

export const FullSpeciality = graphql`
	fragment FullSpeciality on CksSpeciality {
		...PartialSpeciality
		topics {
			...PartialTopic
		}
	}
`;
