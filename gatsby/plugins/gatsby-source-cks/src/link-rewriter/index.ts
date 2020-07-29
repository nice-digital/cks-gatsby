import { NodeModel } from "./types";
import { TopicNode, topicNodeType } from "../node-creation/topics";
import { ChapterNode, chapterNodeType } from "../node-creation/chapters";
import { replaceAsync } from "../utils";
import { NodeInput, Reporter } from "gatsby";

const topicAnchorRegex = /<a(?:(?!<a).)*href="(\/Topic\/ViewTopic\/(.{36}))".*?<\/a>/gi,
	chapterAnchorRegex = /<a(?:(?!<a).)*href="(#(.{36}))".*?<\/a>/gi;

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
	topic: TopicNode,
	nodeModel: NodeModel,
	reporter: Reporter
): Promise<string> => {
	return replaceAsync(
		htmlStringContent,
		topicAnchorRegex,
		async (anchor: string, topicHref: string, topicId: string) => {
			const topicNode = await getTopicById(topicId, nodeModel);

			if (!topicNode) {
				reporter.warn(
					`Could not find topic '${topicId}'\n in link ${anchor}\n in chapter '${chapter.fullItemName}' (${chapter.itemId})\n in topic '${topic.topicName}'`
				);
				return anchor;
			}

			return anchor.replace(topicHref, `/topics/${topicNode.slug}/`);
		}
	);
};

const rewriteChapterLinks = (
	htmlStringContent: string,
	chapter: ChapterNode,
	topic: TopicNode,
	nodeModel: NodeModel,
	reporter: Reporter
): Promise<string> => {
	return replaceAsync(
		htmlStringContent,
		chapterAnchorRegex,
		async (anchor: string, originalHref: string, chapterItemId: string) => {
			const chapterNode = await getChapterById(chapterItemId, nodeModel);

			if (!chapterNode) {
				reporter.warn(
					`Could not find chapter '${chapterItemId}'\n in ${anchor}\n in chapter '${chapter.fullItemName}' (${chapter.itemId}) in ${topic.topicName}`
				);
				return anchor;
			}

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
	nodeModel: NodeModel,
	reporter: Reporter
): Promise<string> => {
	let { htmlStringContent } = chapter;
	const { topic } = chapter;

	const topicNode = await getTopicById(topic, nodeModel);

	if (!topicNode) throw new Error(`Could not find topic with id ${topic}`);

	htmlStringContent = await rewriteTopicLinks(
		htmlStringContent,
		chapter,
		topicNode,
		nodeModel,
		reporter
	);

	htmlStringContent = await rewriteChapterLinks(
		htmlStringContent,
		chapter,
		topicNode,
		nodeModel,
		reporter
	);

	return htmlStringContent;
};
