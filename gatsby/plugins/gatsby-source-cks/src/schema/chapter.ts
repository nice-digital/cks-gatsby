export const chapterSchema = `
	"""
	A chapter of content within a topic, taken from the \`topicHtmlObjects\` field in the API.

	Chapters can nest recursively.
	"""
	type CksChapter implements Node @dontInfer {
		"A lowercased slugified chapter title for use in URL paths e.g. *have-i-got-the-right-topic*"
		slug: String!

		"The guid id of the chapter"
		itemId: String!

		"The name of the chapter e.g. *Have I got the right topic?*"
		fullItemName: String!

		"""
		The HTML heading for the chapter e.g. \`<h1>Achilles tendinopathy: Summary</h1>\` or \`<h2>Changes</h2>\` or \`<h3>Previous changes</h3>\`.

		Notice two things:
		- the heading tag used corresponds to the \`depth\` of the chapter
		- the text isn't necessarily the same as \`fullItemName\` (although often it is)
		"""
		htmlHeader: String!

		"The HTML body of the chapter"
		htmlStringContent: String!

		"""
		An identifier for the chapter, used as a CSS class for the containing element in Clarity's Prodigy. e.g. *annualKnowNewEvidence*.

		Note: it's often camel case but sometimes lowercase e.g. *uptodate*.
		"""
		containerElement: String!

		"The 1-based index representing how deeply nested this chapter is. E.g. Summary has a depth of 1."
		depth: Int!

		"The 0-based index of the chapter at the current depth"
		pos: Int!

		"A reference to the topic to which this chapter belongs"
		topic: CksTopic! @link(by: "topicId")

		"The direct parent chapter in the nesting. The root chapter has no parent so this field is nullable."
		parentChapter: CksChapter @link(by: "itemId")

		"The chapter at the top of the hierarchy. This property is non-null and references itself for the root chapter."
		rootChapter: CksChapter! @link(by: "itemId")

		"""
		Child chapters nested within this one.

		Note: sub chapters are from the the \`children\` field in the API, however,
		we rename them because children is a 'reserved' field in Gatsby
		and is mainly used for transformation relations between nodes
		"""
		subChapters: [CksChapter!] @link(by: "itemId")
	}
`;
