import { NodeInput } from "gatsby";

import { NodeModel } from "./types";
import { TopicNode, topicNodeType } from "../node-creation/topics";
import { ChapterNode, chapterNodeType } from "../node-creation/chapters";

const TopicIdField = "topicId";
const ChapterIdField = "itemId";

interface GetNodeByIdArgs {
	idField: string;
	id: string;
	nodeTypeName: string;
	nodeModel: NodeModel;
}

const getNodeById = <T extends NodeInput>({
	idField,
	id,
	nodeTypeName,
	nodeModel,
}: GetNodeByIdArgs): Promise<T | null> =>
	nodeModel.findOne({
		query: {
			filter: {
				[idField]: { eq: id },
			},
		},
		type: nodeTypeName,
	});

export const getTopicById = (
	topicId: string,
	nodeModel: NodeModel
): Promise<TopicNode | null> =>
	getNodeById({
		idField: TopicIdField,
		id: topicId,
		nodeTypeName: topicNodeType,
		nodeModel,
	});

export const getChapterById = (
	chapterItemId: string,
	nodeModel: NodeModel
): Promise<ChapterNode | null> =>
	getNodeById({
		idField: ChapterIdField,
		id: chapterItemId,
		nodeTypeName: chapterNodeType,
		nodeModel,
	});
