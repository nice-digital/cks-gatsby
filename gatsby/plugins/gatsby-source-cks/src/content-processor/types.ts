// Unfortunately Gatsby doesn't include types for querying via NodeModel so we have to define them here

import { NodeInput } from "gatsby";

export interface BaseQueryArgs {
	type?: string;
}

export interface GetNodeByIdArgs extends BaseQueryArgs {
	id: string;
}

export interface GetNodesByIdsArgs extends BaseQueryArgs {
	ids: string[];
}

interface RunQuery {
	filter: {
		[key: string]: unknown;
	};
}

// export interface RunQueryArgsAll extends BaseQueryArgs {
// 	query: RunQuery & {
// 		sort?: {
// 			fields: string;
// 			order: ["DESC"] | ["ASC"];
// 		};
// 	};
// }

export interface RunQueryArgsFirst extends BaseQueryArgs {
	query: RunQuery;
	firstOnly: true;
}

export interface NodeModel {
	// https://www.gatsbyjs.org/docs/node-model/#getAllNodes
	getAllNodes:
		| (<T extends NodeInput>(args: BaseQueryArgs) => T[])
		| (() => unknown[]);
	// https://www.gatsbyjs.org/docs/node-model/#getNodesByIds
	getNodesByIds: <T extends NodeInput>(args: GetNodesByIdsArgs) => T[];
	// https://www.gatsbyjs.org/docs/node-model/#getNodeById
	getNodeById: <T extends NodeInput>(args: GetNodeByIdArgs) => T | null;
	// https://www.gatsbyjs.org/docs/node-model/#runQuery
	runQuery: <T extends NodeInput>(args: RunQueryArgsFirst) => Promise<T | null>;

	// TODO: Uncomment (and fix!) for querying multiple nodes
	// runQuery: <T extends NodeInput>(
	// 	args: RunQueryArgsSingle | RunQueryArgsAll
	// ) => Promise<T | T[]>;
}

export interface ResolveContext {
	nodeModel: NodeModel;
}
