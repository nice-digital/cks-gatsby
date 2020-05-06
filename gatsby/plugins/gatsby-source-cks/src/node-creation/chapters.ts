// TODO

import { NodeInput } from "gatsby";

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
	internal: {
		children: [];
		type: typeof chapterNodeType;
	} & NodeInput["internal"];
}
