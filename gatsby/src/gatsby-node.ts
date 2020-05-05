import { resolve } from "path";
import { CreatePagesArgs } from "gatsby";
import { PartialTopic, Speciality } from "./types";

interface PageCreationQuery {
	allTopics: {
		nodes: PartialTopic[];
	};
	allSpecialities: {
		nodes: Speciality[];
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

	function createCksPage(id: string, slug: string, templatePath: string): void {
		createPage({
			path: `/${slug}/`,
			component: resolve(templatePath),
			context: {
				id,
			},
		});
	}

	pageCreationQuery.data?.allTopics.nodes.forEach(({ id, slug }) => {
		createCksPage(id, slug, "src/templates/Topic/Topic.tsx");
	});

	pageCreationQuery.data?.allSpecialities.nodes.forEach(({ id, slug }) => {
		createCksPage(id, slug, "src/templates/Speciality/Speciality.tsx");
	});

	return;
};

export const createPages = async (
	createPagesArgs: CreatePagesArgs
): Promise<undefined> => {
	return createCksPages(createPagesArgs);
};
