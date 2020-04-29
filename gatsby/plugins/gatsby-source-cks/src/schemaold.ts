// Custom schema for our CKS-specific nodes
// See https://www.gatsbyjs.org/docs/schema-customization/#creating-type-definitions
// And https://graphql.org/learn/schema/#type-language
// The exclamation mark denotes non-null fields
export const schema = `
	"""
	A change to a single topic, from the \`latestChanges\` field in the API reponse for a full topic.

	> Note: this is not a Node in its own right so can't be queried directly.

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

	For example the topic "Achilles tendinopathy" might have terms of:
	- Achilles Tendon
	- Tendinopathy
	"""
  type CksTopicTerm @dontInfer {
		"The id of the term e.g. D001249"
		code: String!
		"The term text e.g. Asthma or Tendinopathy"
		term: String!
		topics: [CksTopic!]! @link
	}

  type CksChapter implements Node @dontInfer {
    slug: String!
		itemId: String!
    fullItemName: String!
    htmlHeader: String!
    htmlStringContent: String!
    containerElement: String!
    depth: Int!
    pos: Int!
		topic: CksTopic! @link
		# The root chapter has no parent so this field is nullable
    parentChapter: CksChapter @link
		rootChapter: CksChapter! @link
		# Note: sub chapters are from the the children field in the API
		# However, we rename them because children is a 'reserved' field in Gatsby
		# and is mainly used for transformation relations between nodes
    subChapters: [CksChapter!] @link
	}

  type CksTopic implements Node @dontInfer {
    slug: String!
    topicId: String!
    topicName: String!
    topicSummary: String!
    number: Int!
    lastRevised: String!
    # Optional as this is null for some topics
    nextPlannedReviewBy: Date @dateformat
		terms: [CksTopicTerm!]
		# Note: not all topics have specialities defined
    specialities: [CksSpeciality!] @link
    chapters: [CksChapter!]! @link
    latestChanges: [CksTopicLatestChange!] @link
	}

	# A clinical speciality that groups topics together
  type CksSpeciality implements Node @dontInfer {
    name: String!
    slug: String!
    topics: [CksTopic!]! @link
	}

	# A monthly change to a topic, from the changes since API endpoint
	type CksChange implements Node @dontInfer {
		title: String!
		text: String!
		topic: CksTopic! @link
	}
`;
