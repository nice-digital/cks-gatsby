export const changeSchema = `
	"""
	A monthly change or update to a topic. Taken from the *changes-since* API endpoint.
	"""
	type CksChange implements Node @dontInfer {
		"The type of the change. e.g. *Reviewed* or *New topic* etc. Most changes are *reviewed*."
		title: String!

		"A description of the change. Usually 1 or 2 sentences but can be longer"
		text: String!

		"The topic that was affected by this change"
		topic: CksTopic! @link(by: "topicId")
	}
`;
