export const specialitySchema = `
	"""
	A clinical speciality that groups topics together

	For example *Injuries* or *Musculoskeletal*.
	"""
  type CksSpeciality implements Node @dontInfer {
		"The name of the speciality e.g. *Injuries*"
		name: String!

		"The lowercased, slugified title of the speciality used as the path within a URL e.g. *kidney-disease-and-urology*"
		slug: String!

		"The list of topics that belong to this clinical speciality"
    topics: [CksTopic!]! @link(by: "topicId")
	}
`;
