import { NodeModel } from "./types";
import { TopicNode } from "../node-creation/topics";
import { ChapterNode } from "../node-creation/chapters";
import { replaceAsync } from "../utils";

const topicAnchorRegex = /<a.*?"(\/Topic\/ViewTopic\/(.{36}))".*?<\/a>/gi,
	chapterAnchorRegex = /<a.*?"(#(.{36}))".*?<\/a>/gi;

const getTopicById = (
	topicId: string,
	nodeModel: NodeModel
): Promise<TopicNode | null> =>
	nodeModel.runQuery<TopicNode>({
		query: {
			filter: {
				topicId: { eq: topicId },
			},
		},
		firstOnly: true,
		type: "CksTopic",
	});

const getChapterById = (
	chapterItemId: string,
	nodeModel: NodeModel
): Promise<ChapterNode | null> =>
	nodeModel.runQuery<ChapterNode>({
		query: {
			filter: {
				itemId: { eq: chapterItemId },
			},
		},
		firstOnly: true,
		type: "CksChapter",
	});

/**
 * Topic links are in the form /Topic/ViewTopic/<topic guid> in the feed.
 * So these need to be written into the form /topics/<slug>
 */
const rewriteTopicLinks = (
	htmlStringContent: string,
	chapter: ChapterNode,
	nodeModel: NodeModel
): Promise<string> => {
	return replaceAsync(
		htmlStringContent,
		topicAnchorRegex,
		async (anchor: string, topicHref: string, topicId: string) => {
			const topicNode = await getTopicById(topicId, nodeModel);

			if (!topicNode)
				throw new Error(
					`Could not find topic '${topicId}' in ${anchor} for chapter '${chapter.fullItemName}' (${chapter.itemId})`
				);

			return anchor.replace(topicHref, `/topics/${topicNode.slug}/`);
		}
	);
};

const rewriteChapterLinks = (
	htmlStringContent: string,
	chapter: ChapterNode,
	nodeModel: NodeModel
): Promise<string> => {
	return replaceAsync(
		htmlStringContent,
		chapterAnchorRegex,
		async (anchor: string, chapterHref: string, chapterItemId: string) => {
			const chapterNode = await getChapterById(chapterItemId, nodeModel);

			if (!chapterNode)
				throw new Error(
					`Could not find chapter '${chapterItemId}' in ${anchor} in chapter '${chapter.fullItemName}' (${chapter.itemId})`
				);
			else if (chapterNode.depth > 2)
				// TODO
				throw new Error(
					`Depth of ${chapterNode.depth} not supported for chapter link ${anchor}`
				);

			const topicNode = await getTopicById(chapterNode.topic, nodeModel);

			// TODO Get chapter path
			// let chapterPath = `/topics/${topicNode?.slug}/`;

			// if (chapterNode.parentChapter) {
			// 	const parentChapterNode = await getChapterById(
			// 		chapterNode.parentChapter,
			// 		nodeModel
			// 	);
			// 	chapterPath += parentChapterNode?.slug;
			// }

			return anchor.replace(
				chapterHref,
				`/topics/${topicNode?.slug}/${chapterNode.slug}/`
			);
		}
	);
};

export const replaceLinksInHtml = async (
	chapter: ChapterNode,
	nodeModel: NodeModel
): Promise<string> => {
	let { htmlStringContent } = chapter;

	htmlStringContent = await rewriteTopicLinks(
		htmlStringContent,
		chapter,
		nodeModel
	);

	htmlStringContent = await rewriteChapterLinks(
		htmlStringContent,
		chapter,
		nodeModel
	);

	return htmlStringContent;
};
