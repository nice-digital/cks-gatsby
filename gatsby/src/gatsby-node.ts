import path, { resolve } from "path";
import { promises as fs } from "fs";
import { CreatePagesArgs, BuildArgs } from "gatsby";
import {
	PartialTopic,
	PartialSpeciality,
	ChapterLevel1,
	ChapterLevel2,
} from "./types";

interface AllTopicsQuery {
	allTopics: {
		nodes: PartialTopic[];
	};
}

interface PageCreationQuery extends AllTopicsQuery {
	allSpecialities: {
		nodes: PartialSpeciality[];
	};
	level1Chapters: {
		nodes: ChapterLevel1[];
	};
	level2Chapters: {
		nodes: ChapterLevel2[];
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
			level1Chapters: allCksChapter(
				# Don't create a chapter for the summary as we show that for a topic page
				filter: { depth: { eq: 1 }, pos: { gt: 0 } }
			) {
				nodes {
					id
					slug
					fullItemName
					depth
					htmlHeader
					htmlStringContent
					topic {
						id
						topicId
						topicName
						slug
						lastRevised
						chapters {
							id
							fullItemName
							slug
							subChapters {
								id
								slug
								fullItemName
							}
						}
					}
					subChapters {
						id
						slug
						fullItemName
					}
				}
			}
			level2Chapters: allCksChapter(filter: { depth: { eq: 2 } }) {
				nodes {
					id
					slug
					fullItemName
					depth
					htmlHeader
					htmlStringContent
					topic {
						id
						topicId
						topicName
						slug
						lastRevised
						chapters {
							id
							fullItemName
							slug
							subChapters {
								id
								slug
								fullItemName
							}
						}
					}
					parentChapter {
						id
						slug
						fullItemName
					}
					# Load sub chapters recurisvely for levels 2+
					subChapters {
						id
						slug
						fullItemName
						depth
						htmlHeader
						htmlStringContent
						subChapters {
							id
							slug
							fullItemName
							depth
							htmlHeader
							htmlStringContent
							subChapters {
								id
								slug
								fullItemName
								depth
								htmlHeader
								htmlStringContent
								subChapters {
									id
									slug
									fullItemName
									depth
									htmlHeader
									htmlStringContent
									subChapters {
										id
										slug
										fullItemName
										depth
										htmlHeader
										htmlStringContent
									}
								}
							}
						}
					}
				}
			}
		}
	`);

	if (pageCreationQuery.errors) {
		throw pageCreationQuery.errors;
	}

	function createCksPage(
		path: string,
		templateName: string,
		context: unknown
	): void {
		createPage({
			path,
			component: resolve(`src/templates/${templateName}/${templateName}.tsx`),
			context,
		});
	}

	pageCreationQuery.data?.allTopics.nodes.forEach(({ id, slug }) => {
		createCksPage(`/topics/${slug}/`, "Topic", { id });
	});

	pageCreationQuery.data?.allSpecialities.nodes.forEach(({ id, slug }) => {
		createCksPage(`/specialities/${slug}/`, "Speciality", { id });
	});

	pageCreationQuery.data?.level1Chapters.nodes.forEach((chapter) => {
		createCksPage(
			`/topics/${chapter.topic.slug}/${chapter.slug}/`,
			"ChapterLevel1",
			{ chapter }
		);
	});

	pageCreationQuery.data?.level2Chapters.nodes.forEach((chapter) => {
		createCksPage(
			`/topics/${chapter.topic.slug}/${chapter.parentChapter.slug}/${chapter.slug}/`,
			"ChapterLevel2",
			{ chapter }
		);
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
			`RewriteRule ^/${slug.replace(/-/g, "_")}$ /topics/${slug}/ [L,R=301]`,
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
