import { resolve } from "path";
import { CreatePagesArgs } from "gatsby";
import { PartialTopic } from "./types";

interface AllTopicsQueryData {
	allTopics: {
		nodes: PartialTopic[];
	};
}

export const createPages = async ({
	graphql,
	actions,
}: CreatePagesArgs): Promise<undefined> => {
	const { createPage } = actions;

	const allTopicsQuery = await graphql<AllTopicsQueryData>(`
		{
			allTopics: allCksTopic {
				nodes {
					id
					slug
				}
			}
		}
	`);
	if (allTopicsQuery.data !== undefined)
		allTopicsQuery.data.allTopics.nodes.forEach(({ id, slug }) => {
			createPage({
				path: `/${slug}/`,
				component: resolve("src/templates/Topic/Topic.tsx"),
				context: {
					id,
				},
			});
		});

	return;
};
