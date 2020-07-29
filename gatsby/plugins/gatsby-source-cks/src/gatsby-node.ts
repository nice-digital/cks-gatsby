import {
	SourceNodesArgs,
	CreateSchemaCustomizationArgs,
	CreateResolversArgs,
} from "gatsby";

import { schema } from "./schema";
import { configure } from "./api/api";
import { downloadAllData } from "./downloader/downloader";
import { createTopicNodes } from "./node-creation/topics";
import { createSpecialityNodes } from "./node-creation/specialities";
import { createChangeNodes } from "./node-creation/changes";

import { createChapterNotes, ChapterNode } from "./node-creation/chapters";
import { replaceLinksInHtml } from "./link-rewriter";
import { ResolveContext } from "./link-rewriter/types";

interface ConfigOptions {
	/** The API base URL */
	apiBaseUrl: string;
	/** The api key for authentication via a request header */
	apiKey: string;
	/** The date from which to load changes. */
	changesSinceDate: Date;
}

/**
 * Gatsby hook for customizing the schema.
 * See https://www.gatsbyjs.org/docs/schema-customization/
 */
export const createSchemaCustomization = ({
	actions: { createTypes },
}: CreateSchemaCustomizationArgs): void => createTypes(schema);

/**
 * Gatsby hook for creating nodes from a plugin.
 * See https://www.gatsbyjs.org/docs/creating-a-source-plugin/#sourcing-data-and-creating-nodes
 */
export const sourceNodes = async (
	sourceNodesArgs: SourceNodesArgs,
	configOptions: ConfigOptions
): Promise<undefined> => {
	const {
		reporter: { activityTimer, info },
	} = sourceNodesArgs;

	info(
		`Date for getting major changes/updates: ${configOptions.changesSinceDate.toISOString()}`
	);

	const { start, setStatus, end } = activityTimer(
		`Download data and creating CKS nodes`
	);
	start();

	// Configure the API authentication and base URL before downloading data
	configure(configOptions);
	const { fullTopics, changes } = await downloadAllData(
		sourceNodesArgs,
		configOptions.changesSinceDate
	);

	// Create all of our different nodes
	createTopicNodes(fullTopics, sourceNodesArgs);
	createSpecialityNodes(fullTopics, sourceNodesArgs);
	createChangeNodes(changes, sourceNodesArgs);
	createChapterNotes(fullTopics, sourceNodesArgs);

	setStatus(`Created all nodes`);
	end();

	return;
};

/**
 * Gatsby hook for resolving fields
 * See https://www.gatsbyjs.org/docs/schema-customization/#createresolvers-api
 */
export const createResolvers = ({
	reporter,
	createResolvers,
}: CreateResolversArgs): void => {
	createResolvers({
		CksChapter: {
			// Rewrite HTML within the body field.
			// We do this as a resolver (rather than when we create the nodes)
			// This means all the nodes (and slug fields) are available for querying.
			htmlStringContent: {
				async resolve(
					chapter: ChapterNode,
					_args: unknown,
					resolveContext: ResolveContext
				): Promise<string> {
					return replaceLinksInHtml(
						chapter,
						resolveContext.nodeModel,
						reporter
					);
				},
			},
		},
	});
};
