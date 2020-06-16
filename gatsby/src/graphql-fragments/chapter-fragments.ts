import { graphql } from "gatsby";

export const PartialChapter = graphql`
	fragment PartialChapter on CksChapter {
		id
		slug
		fullItemName
		# We only need 2 levels of chapters for menus
		subChapters {
			id
			slug
			fullItemName
		}
	}
`;

export const PartialChapterWithContent = graphql`
	fragment PartialChapterWithContent on CksChapter {
		...PartialChapter
		htmlStringContent
		htmlHeader
	}
`;

export const FullChapter = graphql`
	fragment FullChapter on CksChapter {
		...PartialChapterWithContent
		# Nest 'enough' levels deep for nested chapters because GraphQL doesn't allow recursion
		subChapters {
			...PartialChapterWithContent
			subChapters {
				...PartialChapterWithContent
				subChapters {
					...PartialChapterWithContent
					subChapters {
						...PartialChapterWithContent
					}
				}
			}
		}
		parentChapter {
			...PartialChapter
		}
		topic {
			...PartialTopic
			chapters {
				...PartialChapter
			}
		}
	}
`;
