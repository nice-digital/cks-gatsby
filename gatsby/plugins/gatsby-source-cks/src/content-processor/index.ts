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
		async (anchor: string, originalHref: string, chapterItemId: string) => {
			const chapterNode = await getChapterById(chapterItemId, nodeModel);

			if (!chapterNode)
				throw new Error(
					`Could not find chapter '${chapterItemId}' in ${anchor} in chapter '${chapter.fullItemName}' (${chapter.itemId})`
				);

			const topicNode = await getTopicById(chapterNode.topic, nodeModel);

			let href = `/topics/${topicNode?.slug}/`;

			if (!chapterNode.parentChapter) {
				// Top level chapter
				href += `${chapterNode.slug}/`;
			} else {
				const rootChapterNode = await getChapterById(
					chapterNode.rootChapter,
					nodeModel
				);

				href += `${rootChapterNode?.slug}/`;

				if (chapterNode.parentChapter === chapterNode.rootChapter) {
					// Second level chapter
					href += `${chapterNode.slug}/`;
				} else {
					// Third+ level chapter
					const parentChapterNode = await getChapterById(
						chapterNode.parentChapter,
						nodeModel
					);

					href += `${parentChapterNode?.slug}/#${chapterNode.slug}`;
				}
			}

			return anchor.replace(originalHref, href);
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
