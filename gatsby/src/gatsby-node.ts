import path, { resolve } from "path";
import { promises as fs } from "fs";
import { CreatePagesArgs, BuildArgs } from "gatsby";
import { PartialTopic, PartialSpeciality } from "./types";

interface AllTopicsQuery {
	allTopics: {
		nodes: PartialTopic[];
	};
}

interface PageCreationQuery extends AllTopicsQuery {
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

// Gatsby hook for 'last extension point called after all other parts of the build process are complete'
// Seehttps://www.gatsbyjs.org/docs/node-apis/#onPostBuild
// Generates .htaccess file based on topics
export const onPostBuild = async ({
	graphql,
	reporter,
}: BuildArgs): Promise<void> => {
	const timer = reporter.activityTimer("Creating htaccess");
	timer.start();
	timer.setStatus("Writing .htaccess");

	const allTopicsQuery = await graphql<AllTopicsQuery>(`
		{
			allTopics: allCksTopic {
				nodes {
					id
					slug
				}
			}
		}
	`);

	const existingHtaccessContents = await fs.readFile(
		path.join(__dirname, "../static", ".htaccess"),
		"utf-8"
	);

	const topicRules = allTopicsQuery.data?.allTopics.nodes.map(({ slug }) =>
		[
			// Topics used to be in the root so redirect them down a level
			`RewriteRule ^/(${slug}) /topics/$1/ [L,R=301]`,
			// We used to (way back) use underscores for topics
			`RewriteRule ^/(${slug.replace(/-/g, "_")})$ /topics/$1/ [L,R=301]`,
		].join("\n")
	);

	const htaccessContents =
		existingHtaccessContents + "\n" + topicRules?.join("\n");

	await fs.writeFile(
		path.join(__dirname, "../public", ".htaccess"),
		htaccessContents
	);

	timer.setStatus("Written .htaccess");
	timer.end();
};
