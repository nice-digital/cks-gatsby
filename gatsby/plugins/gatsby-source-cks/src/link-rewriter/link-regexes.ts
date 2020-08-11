/**
 * Anchors to a different topic.
 *
 * @example
 * <a class="topic-reference external-reference" href="/Topic/ViewTopic/a549c958-335f-4dcd-b76d-e9f87325d888">Chest pain</a>
 */
export const topicAnchorRegex = /<a(?:(?!<a).)*href="(\/Topic\/ViewTopic\/(.{36}))".*?<\/a>/gi;

/**
 * Anchors to a chapter within the same topic.
 *
 * @example
 * <a class="bibliography-reference internal-reference" href="#666cef38-2cdb-45b8-a427-aaffb3caa682">NICE, 2016a</a>
 */
export const chapterAnchorRegex = /<a(?:(?!<a).)*href="(#(.{36}))".*?<\/a>/gi;

/**
 * Anchors to a chapter within a different topic.
 *
 * @example
 * <a
 * 	class="topic-reference external-reference"
 * 	href="/Topic/ViewTopic/a549c958-335f-4dcd-b76d-e9f87325d888#67439879-2ad5-4721-b865-5aadd9bebe52">
 * 		chest pain
 * </a>
 */
export const topicChapterAnchorRegex = /<a(?:(?!<a).)*href="(\/Topic\/ViewTopic\/(.{36})#(.{36}))".*?<\/a>/gi;
