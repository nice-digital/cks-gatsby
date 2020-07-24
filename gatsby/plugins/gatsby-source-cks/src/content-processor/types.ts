// Unfortunately Gatsby doesn't include types for querying via NodeModel so we have to define them here

import { NodeInput } from "gatsby";
import { GraphQLOutputType } from "graphql";

interface BaseQueryArgs {
	type?: string | GraphQLOutputType;
}

interface GetNodeByIdArgs extends BaseQueryArgs {
	id: string;
}

interface GetNodesByIdsArgs extends BaseQueryArgs {
	ids: string[];
}

interface RunQuery {
	filter: {
		[key: string]: unknown;
	};
}

export interface RunQueryArgsFirst extends BaseQueryArgs {
	firstOnly: true;
	query: RunQuery;
}

export interface RunQueryArgsAll extends BaseQueryArgs {
	query: RunQuery & {
		sort?: {
			fields: string | string[];
			order: ("DESC" | "ASC")[];
		};
	};
	firstOnly?: false;
}

export interface NodeModel {
	// https://www.gatsbyjs.org/docs/node-model/#getAllNodes
	getAllNodes<T extends NodeInput>(args: BaseQueryArgs): T[];
	getAllNodes(): unknown[];

	// https://www.gatsbyjs.org/docs/node-model/#getNodesByIds
	getNodesByIds<T extends NodeInput>(args: GetNodesByIdsArgs): T[];

	// https://www.gatsbyjs.org/docs/node-model/#getNodeById
	getNodeById<T extends NodeInput>(args: GetNodeByIdArgs): T | null;

	// https://www.gatsbyjs.org/docs/node-model/#runQuery
	runQuery<T extends NodeInput>(args: RunQueryArgsFirst): Promise<T | null>;
	runQuery<T extends NodeInput>(args: RunQueryArgsAll): Promise<T[] | null>;
}

export interface ResolveContext {
	nodeModel: NodeModel;
}
