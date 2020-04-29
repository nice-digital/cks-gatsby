import { topicSchema } from "./topic";
import { specialitySchema } from "./speciality";
import { chapterSchema } from "./chapter";
import { changeSchema } from "./change";

// Custom schema for our CKS-specific nodes
// See https://www.gatsbyjs.org/docs/schema-customization/#creating-type-definitions
// And https://graphql.org/learn/schema/#type-language
export const schema = [
	topicSchema,
	specialitySchema,
	chapterSchema,
	changeSchema,
].join("\n\n");
