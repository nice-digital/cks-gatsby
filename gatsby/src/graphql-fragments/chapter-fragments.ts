import { graphql } from "gatsby";

export const PartialChapter = graphql`
	fragment PartialChapter on CksChapter {
		id
		slug
		fullItemName
		# We only need 2 levels of chapters for the topic menu
		# so no need to select subChapter recursively here
		subChapters {
			id
			slug
			fullItemName
		}
	}
`;
