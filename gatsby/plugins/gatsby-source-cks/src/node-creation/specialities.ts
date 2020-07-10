/**
 * Creates Gatsby GraphQL nodes for specialities (that group topics together) from downloaded data
 */

import { SourceNodesArgs, NodeInput } from "gatsby";
import slugify from "slugify";

import { ApiFullTopic } from "../api/types";

const specialityNodeType = "CksSpeciality";

interface SpecialityNode extends NodeInput {
	name: string;
	slug: string;
	// Foreign keys
	topics: string[];
	internal: {
		type: typeof specialityNodeType;
	} & NodeInput["internal"];
}

/**
 * Pull out each of the topics's clinicalSpecialties into
 * a mapping of speciality name to topic ids
 * e.g. { 'Skin and nail': [ 1, 2 ], Cardiovascular: [ 1, 3 ], ... }
 *
 * @param topics
 */
const extractSpecialities = (topics: ApiFullTopic[]): Map<string, string[]> => {
	const mapping: Map<string, string[]> = new Map();

	topics.forEach(({ topicId, clinicalSpecialties }) => {
		clinicalSpecialties.forEach((speciality) =>
			mapping.set(speciality, [...(mapping.get(speciality) || []), topicId])
		);
	});

	return mapping;
};

export const createSpecialityNodes = (
	fullTopics: ApiFullTopic[],
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { createNodeId, createContentDigest, actions } = sourceNodesArgs;
	const { createNode } = actions;

	const specialityTopicsMapping = extractSpecialities(fullTopics);

	Array.from(specialityTopicsMapping.entries()).forEach(([name, topics]) => {
		const nodeContent = {
			name,
			slug: slugify(name, { lower: true, remove: /[(),']/g }),
			topics,
		};

		const specialityNode: SpecialityNode = {
			...nodeContent,
			id: createNodeId(name),
			internal: {
				type: specialityNodeType,
				content: JSON.stringify(nodeContent),
				contentDigest: createContentDigest(nodeContent),
			},
		};

		createNode(specialityNode);
	});
};
