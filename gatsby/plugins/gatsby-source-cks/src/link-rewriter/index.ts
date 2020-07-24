import { NodeModel } from "./types";
import { TopicNode, topicNodeType } from "../node-creation/topics";
import { ChapterNode, chapterNodeType } from "../node-creation/chapters";
import { replaceAsync } from "../utils";
import { NodeInput } from "gatsby";

const topicAnchorRegex = /<a.*?href="(\/Topic\/ViewTopic\/(.{36}))".*?<\/a>/gi,
	chapterAnchorRegex = /<a.*?href="(#(.{36}))".*?<\/a>/gi;

const getNodeById = <T extends NodeInput>(
	idField: string,
	id: string,
	nodeTypeName: string,
	nodeModel: NodeModel
): Promise<T | null> =>
	nodeModel.runQuery({
		query: {
			filter: {
				[idField]: { eq: id },
			},
		},
		firstOnly: true,
		type: nodeTypeName,
	});

const getTopicById = (
	topicId: string,
	nodeModel: NodeModel
): Promise<TopicNode | null> =>
	getNodeById("topicId", topicId, topicNodeType, nodeModel);

const getChapterById = (
	chapterItemId: string,
	nodeModel: NodeModel
): Promise<ChapterNode | null> =>
	getNodeById("itemId", chapterItemId, chapterNodeType, nodeModel);

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
		async (anchor: string, originalHref: string, chapterItemId: string) => {
			const chapterNode = await getChapterById(chapterItemId, nodeModel);

			if (!chapterNode)
				throw new Error(
					`Could not find chapter '${chapterItemId}' in ${anchor} in chapter '${chapter.fullItemName}' (${chapter.itemId})`
				);

			const topicNode = await getTopicById(chapterNode.topic, nodeModel),
				topicPath = `/topics/${topicNode?.slug}/`;

			// Top level chapter
			if (!chapterNode.parentChapter) {
				return anchor.replace(originalHref, `${topicPath}${chapterNode.slug}/`);
			}

			// Second level chapter
			const parentChapterNode = await getChapterById(
				chapterNode.parentChapter,
				nodeModel
			);
			if (chapterNode.parentChapter === chapterNode.rootChapter) {
				return anchor.replace(
					originalHref,
					`${topicPath}${parentChapterNode?.slug}/${chapterNode.slug}/`
				);
			}

			// Third+ level chapter
			const rootChapterNode = await getChapterById(
				chapterNode.rootChapter,
				nodeModel
			);
			return anchor.replace(
				originalHref,
				`${topicPath}${rootChapterNode?.slug}/${parentChapterNode?.slug}/#${chapterNode.slug}`
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
