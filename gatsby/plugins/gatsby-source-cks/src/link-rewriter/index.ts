import { Reporter } from "gatsby";
import { NodeModel } from "./types";
import { ChapterNode } from "../node-creation/chapters";
import { replaceAsync } from "../utils";

import { getTopicById, getChapterById } from "./node-model-extensions";
import {
	topicAnchorRegex,
	chapterAnchorRegex,
	topicChapterAnchorRegex,
} from "./link-regexes";

interface LinkRewriteArgs {
	htmlStringContent: string;
	nodeModel: NodeModel;
	//reporter: Reporter;
	//getErrorMessage: (message: string, anchor: string) => string;
	warn: (message: string, anchor: string) => void;
	error: (message: string, anchor: string) => void;
}

/**
 * Topic links are in the form /Topic/ViewTopic/<topic guid> in the feed.
 * So these need to be written into the form /topics/<slug>
 */
const rewriteTopicLinks = ({
	htmlStringContent,
	nodeModel,
	warn,
}: LinkRewriteArgs): Promise<string> => {
	return replaceAsync(
		htmlStringContent,
		topicAnchorRegex,
		async (anchor: string, originalHref: string, targetTopicId: string) => {
			const targetTopic = await getTopicById(targetTopicId, nodeModel);

			if (!targetTopic) {
				warn(`Could not find topic '${targetTopicId}'`, anchor);
				return anchor;
			}

			return anchor.replace(originalHref, `/topics/${targetTopic.slug}/`);
		}
	);
};

const rewriteChapterLinks = ({
	htmlStringContent,
	nodeModel,
	warn,
	error,
}: LinkRewriteArgs): Promise<string> => {
	return replaceAsync(
		htmlStringContent,
		chapterAnchorRegex,
		async (anchor: string, originalHref: string, targetChapterId: string) => {
			const targetChapter = await getChapterById(targetChapterId, nodeModel);

			if (!targetChapter) {
				warn(`Could not find chapter '${targetChapterId}'`, anchor);
				return anchor;
			}

			const targetChapterhref = await getChapterHref(targetChapter, nodeModel);

			if (!targetChapterhref) {
				error(`6th level link found in '${targetChapterId}'`, anchor);
				return anchor;
			}

			return anchor.replace(originalHref, targetChapterhref);
		}
	);
};

const rewriteTopicChapterLinks = ({
	htmlStringContent,
	nodeModel,
	warn,
	error,
}: LinkRewriteArgs): Promise<string> =>
	replaceAsync(
		htmlStringContent,
		topicChapterAnchorRegex,
		async (
			anchor: string,
			originalHref: string,
			targetTopicId: string,
			targetChapterId: string
		) => {
			const targetTopic = await getTopicById(targetTopicId, nodeModel);

			if (!targetTopic) {
				warn(`Could not find topic '${targetTopicId}'`, anchor);
				return anchor;
			}

			const targetChapter = await getChapterById(targetChapterId, nodeModel);

			if (!targetChapter) {
				warn(`Could not find chapter '${targetChapterId}'`, anchor);
				return anchor;
			} else if (targetChapter.topic !== targetTopicId) {
				warn(
					`Chapter '${targetChapterId}' topic (${targetChapter.topic}) doesn't match topic in href (${targetTopicId})`,
					anchor
				);
				return anchor;
			}

			const targetChapterhref = await getChapterHref(targetChapter, nodeModel);

			if (!targetChapterhref) {
				error(`6th level link found in '${targetChapterId}'`, anchor);
				return anchor;
			}

			return anchor.replace(originalHref, targetChapterhref);
		}
	);

const getChapterHref = async (
	targetChapterNode: ChapterNode,
	nodeModel: NodeModel
): Promise<string | null> => {
	const topicNode = await getTopicById(targetChapterNode.topic, nodeModel),
		topicPath = `/topics/${topicNode?.slug}/`;

	// Top level chapter
	if (!targetChapterNode.parentChapter) {
		return `${topicPath}${targetChapterNode.slug}/`;
	}

	// Second level chapter
	const parentChapterNode = await getChapterById(
		targetChapterNode.parentChapter,
		nodeModel
	);
	if (parentChapterNode?.itemId === targetChapterNode.rootChapter) {
		return `${topicPath}${parentChapterNode?.slug}/${targetChapterNode.slug}/`;
	}

	// Third level chapter
	const grandParentChapterNode = await getChapterById(
		parentChapterNode?.parentChapter as string,
		nodeModel
	);
	if (grandParentChapterNode?.itemId === targetChapterNode.rootChapter) {
		return `${topicPath}${grandParentChapterNode?.slug}/${parentChapterNode?.slug}/#${targetChapterNode.slug}`;
	}

	// Fourth level chapter
	const greatGrandParentChapterNode = await getChapterById(
		grandParentChapterNode?.parentChapter as string,
		nodeModel
	);
	if (greatGrandParentChapterNode?.itemId === targetChapterNode.rootChapter) {
		return `${topicPath}${greatGrandParentChapterNode?.slug}/${grandParentChapterNode?.slug}/#${targetChapterNode.slug}`;
	}

	// Fifth level chapter
	const greatGreatGrandParentChapterNode = await getChapterById(
		greatGrandParentChapterNode?.parentChapter as string,
		nodeModel
	);
	if (
		greatGreatGrandParentChapterNode?.itemId === targetChapterNode.rootChapter
	) {
		return `${topicPath}${greatGreatGrandParentChapterNode?.slug}/${greatGrandParentChapterNode?.slug}/#${targetChapterNode.slug}`;
	}

	// 6th level isn't supported
	return null;
};

export const replaceLinksInHtml = async (
	currentChapter: ChapterNode,
	nodeModel: NodeModel,
	reporter: Reporter
): Promise<string> => {
	const { htmlStringContent } = currentChapter;
	const { topic: topicId } = currentChapter;

	const currentTopic = await getTopicById(topicId, nodeModel);

	if (!currentTopic) {
		reporter.error(`Could not find topic with id ${topicId}`);
		return "Error";
	}

	// Generates a useful error message with the anchor location to make it easier to find the bad link in the feed
	const getErrorMessage = (message: string, anchor: string) =>
		[
			message,
			` in link ${anchor}`,
			` in chapter '${currentChapter.fullItemName}' (${currentChapter.itemId})`,
			` in topic '${currentTopic.topicName}' (${currentTopic.topicId})`,
		].join("\n");

	const args: LinkRewriteArgs = {
		htmlStringContent,
		nodeModel,
		warn: (message: string, anchor: string) =>
			reporter.warn(getErrorMessage(message, anchor)),
		error: (message: string, anchor: string) =>
			reporter.error(getErrorMessage(message, anchor)),
	};

	args.htmlStringContent = await rewriteTopicLinks(args);
	args.htmlStringContent = await rewriteChapterLinks(args);
	args.htmlStringContent = await rewriteTopicChapterLinks(args);

	return args.htmlStringContent;
};
