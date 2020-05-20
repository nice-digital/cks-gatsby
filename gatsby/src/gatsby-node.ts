import { resolve } from "path";
import { CreatePagesArgs } from "gatsby";
import { PartialTopic, PartialSpeciality } from "./types";

interface PageCreationQuery {
	allTopics: {
		nodes: PartialTopic[];
	};
	allSpecialities: {
		nodes: PartialSpeciality[];
	};
}

const createCksPages = async ({
	graphql,
	actions,
}: CreatePagesArgs): Promise<undefined> => {
	const { createPage } = actions;

	const pageCreationQuery = await graphql<PageCreationQuery>(`
		{
			allSpecialities: allCksSpeciality {
				nodes {
					id
					name
					slug
				}
			}
			allTopics: allCksTopic {
				nodes {
					id
					slug
				}
			}
		}
	`);

	function createCksPage(id: string, path: string, templateName: string): void {
		createPage({
			path,
			component: resolve(`src/templates/${templateName}/${templateName}.tsx`),
			context: {
				id,
			},
		});
	}

	pageCreationQuery.data?.allTopics.nodes.forEach(({ id, slug }) => {
		createCksPage(id, `/topics/${slug}/`, "Topic");
	});

	pageCreationQuery.data?.allSpecialities.nodes.forEach(({ id, slug }) => {
		createCksPage(id, `/specialities/${slug}/`, "Speciality");
	});

	return;
};

export const createPages = async (
	createPagesArgs: CreatePagesArgs
): Promise<undefined> => {
	return createCksPages(createPagesArgs);
};
