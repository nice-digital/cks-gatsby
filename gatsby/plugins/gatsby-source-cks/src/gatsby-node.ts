import { SourceNodesArgs, CreateSchemaCustomizationArgs } from "gatsby";

import { schema } from "./schema";
import { createFakeNodes } from "./create-fake-nodes";

export const createSchemaCustomization = ({
	actions: { createTypes },
}: CreateSchemaCustomizationArgs): void => createTypes(schema);

export const sourceNodes = async (
	sourceNodesArgs: SourceNodesArgs
): Promise<undefined> => {
	const { reporter } = sourceNodesArgs;

	const activity = reporter.activityTimer(`Creating nodes`);
	activity.start();

	createFakeNodes(sourceNodesArgs);

	activity.setStatus(`Created nodes`);
	activity.end();

	return;
};
