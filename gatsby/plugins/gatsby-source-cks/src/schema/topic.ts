export const topicSchema = `
	"""
	A update or change to a topic, taken from the \`latestChanges\` field in the API reponse for a full topic.

	> Note: this is not a node in its own right so can't be queried directly.

	Don't confuse this with the \`CksChange\` node type.
	"""
	type CksTopicLatestChange @dontInfer {
		"The first day of the month in which this change occurred e.g. \`2016-01-01T00:00:00+00:00\`"
		dateFrom: Date! @dateformat

		"The last day of the month in which this change occurred e.g. \`2016-01-31T23:59:59+00:00\`"
		dateTo: Date! @dateformat

		"The type of the change for example *Reviewed*, *Minor update*, *Revised* etc"
		title: String!

		"A description of the change"
		body: String!
	}

	"""
	A term for a topic, from the \`terms\` field in the API reponse for a full topic.

	> Note: this is not a node in its own right so can't be queried directly.

	For example the topic "Achilles tendinopathy" might have terms of:
	- Achilles Tendon
	- Tendinopathy
	"""
	type CksTopicTerm @dontInfer {
		"The id of the term e.g. *D001249*"
		code: String!

		"The term text e.g. *Asthma* or *Tendinopathy*"
		term: String!
	}

	"""
	A full topic object, taken from the */topic/guid* endpoint in the API.
	"""
	type CksTopic implements Node @dontInfer {
		"The lowercase slugified title, used as the path within a URL e.g. *achilles-tendinopathy*"
		slug: String!

		"The guid id of the topic taken from the feed"
		topicId: String!

		"The name of the topic e.g. *Achilles tendinopathy*"
		topicName: String!

		"A summary of the topic in 1 or 2 sentences"
		topicSummary: String!

		"The latest version number"
		number: Int!

		"The date of the last revision as text e.g. *Last revised in January 2016*"
		lastRevised: String!

		"The date by which this topic will be reviewed. Optional as this is null for some topics."
		nextPlannedReviewBy: Date @dateformat

		"A list of terms related to this topic. Not every topic has other terms."
		terms: [CksTopicTerm!]!

		"""
		A list of specialities to which this topic belongs.

		For example, *Achilles tendinopathy* is in both *Injuries* and *Musculoskeletal*.

		Note: not all topics have specialities defined.
		"""
		specialities: [CksSpeciality!]! @link(by: "name")

		"The content chapters within the topic, taken from the \`topicHtmlObjects\` field in the API."
		chapters: [CksChapter!]! @link

		"The last changes or reviews that the topic has had. Not to be confused with the other node type of \`CksChange\`."
		latestChanges: [CksTopicLatestChange!]! @link
	}
`;
