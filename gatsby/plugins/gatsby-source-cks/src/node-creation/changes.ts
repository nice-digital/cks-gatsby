// TODO

import { NodeInput } from "gatsby";

export const changeNodeType = "CksChange";

export interface ChangeNode extends NodeInput {
	title: string;
	text: string;
	// Foreign keys
	topic: string;
	internal: {
		type: typeof changeNodeType;
	} & NodeInput["internal"];
}
