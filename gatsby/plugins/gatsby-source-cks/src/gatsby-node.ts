import { SourceNodesArgs, CreateSchemaCustomizationArgs } from "gatsby";

import { schema } from "./schema";
import { configure } from "./api/api";
import { downloadAllData } from "./downloader/downloader";
import { createTopicNodes } from "./node-creation/topics";
import { createSpecialityNodes } from "./node-creation/specialities";
import { createChangeNodes } from "./node-creation/changes";
import { createChapterNotes } from "./node-creation/chapters";

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
