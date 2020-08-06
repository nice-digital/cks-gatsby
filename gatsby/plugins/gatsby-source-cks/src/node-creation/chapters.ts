/**
 * Creates Gatsby GraphQL nodes for chapters (HTML objects within topics) from downloaded data
 */

import { NodeInput, SourceNodesArgs } from "gatsby";
import slugify from "slugify";

import { ApiFullTopic, ApiTopicHtmlObject } from "../api/types";

export const chapterNodeType = "CksChapter";

export interface ChapterNode extends NodeInput {
	slug: string;
	itemId: string;
	fullItemName: string;
	htmlHeader: string;
	htmlStringContent: string;
	containerElement: string;
	depth: number;
	pos: number;
	// Foreign keys
	topic: string;
	parentChapter: string | null;
	rootChapter: string;
	subChapters: string[];
	children?: undefined;
	internal: {
		type: typeof chapterNodeType;
	} & NodeInput["internal"];
}

const createTopicChapterNodes = (
	topicId: string,
	topicHtmlObjects: ApiTopicHtmlObject[],
	sourceNodesArgs: SourceNodesArgs
): void => {
	const { createNodeId, createContentDigest, actions } = sourceNodesArgs;
	const { createNode } = actions;

	topicHtmlObjects.forEach(
		({
			itemId,
			containerElement,
			parentId,
			rootId,
			children,
			fullItemName,
			htmlStringContent,
			...chapterFields
		}) => {
			const slug = slugify(
				fullItemName.replace(/^Scenario: /gi, "").replace(/ and /gi, " "),
				{
					lower: true,
					remove: /[,*+~.()'"!?:@]/g,
				}
			);

			// The feed content has absolute paths to the old development page
			// so we replace them with the relative path so that the links work
			// locally and use Gatsby's navigate function
			htmlStringContent = htmlStringContent.replace(
				/http:\/\/cks\.nice\.org\.uk\/development/g,
				"/about/development/"
			);

			const nodeContent = {
				...chapterFields,
				htmlStringContent,
				slug,
				fullItemName,
				containerElement,
				itemId,
				topic: topicId,
				parentChapter: parentId,
				rootChapter: rootId,
				subChapters: children.map((c) => c.itemId),
			};

			const chapterNode: ChapterNode = {
				...nodeContent,
				id: createNodeId(itemId),
				internal: {
					type: chapterNodeType,
					content: JSON.stringify(nodeContent),
					contentDigest: createContentDigest(nodeContent),
				},
			};

			createNode(chapterNode);

			// Recursively create sub chapters
			createTopicChapterNodes(topicId, children, sourceNodesArgs);
		}
	);
};

export const createChapterNotes = (
	topics: ApiFullTopic[],
	sourceNodesArgs: SourceNodesArgs
): void => {
	topics.forEach(({ topicId, topicHtmlObjects }) => {
		createTopicChapterNodes(topicId, topicHtmlObjects, sourceNodesArgs);
	});
};
