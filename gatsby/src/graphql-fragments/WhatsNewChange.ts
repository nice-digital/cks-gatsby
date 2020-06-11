import { graphql } from "gatsby";

export const WhatsNewChange = graphql`
	fragment WhatsNewChange on CksChange {
		id
		title
		text
		topic {
			...PartialTopic
		}
	}
`;
