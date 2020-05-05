import { resolve } from "path";
import { CreatePagesArgs } from "gatsby";
import { PartialTopic, Speciality } from "./types";

interface AllTopicsQueryData {
	allTopics: {
		nodes: PartialTopic[];
	};
}

interface AllSpecialitiesQueryData {
	allSpecialities: {
		nodes: Speciality[];
	};
}

const createSpecialityPage = async ({
	graphql,
	actions,
}: CreatePagesArgs): Promise<undefined> => {
	const { createPage } = actions;

	const allSpecialityQuery = await graphql<AllSpecialitiesQueryData>(`
		{
			allSpecialities: allCksSpeciality {
				edges {
					node {
						id
						slug
					}
				}
			}
		}
	`);
	if (allSpecialityQuery.data !== undefined)
		allSpecialityQuery.data.allSpecialities.nodes.forEach(({ id, slug }) => {
			createPage({
				path: `/${slug}/`,
				component: resolve("src/templates/Speciality.tsx"),
				context: {
					id,
				},
			});
		});

	return;
};

const createTopicPage = async ({
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

export const createPages = async (
	reatePagesArgs: CreatePagesArgs
): Promise<undefined[]> => {
	const createPageTaks: Array<Promise<undefined>> = [
		createSpecialityPage(reatePagesArgs),
		createTopicPage(reatePagesArgs),
	];

	return Promise.all(createPageTaks);
};
