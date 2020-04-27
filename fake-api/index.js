const express = require("express"),
	path = require("path"),
	fsPromises = require("fs").promises;
const app = express();
const port = 7000;

const allTopicsResponse = require("./data/topics.json");

app.get("/api/topics", (req, res) => res.json(allTopicsResponse));

app.get("/api/topic/:topicId", async (req, res) => {
	const topicId = req.params.topicId;

	if (!topicId || topicId.length === 0)
		return res.status(404).json({
			message: "Please provide a topicId parameter e.g. /api/topic/123",
		});

	if (allTopicsResponse.topics.every((t) => t.id !== topicId))
		return res.status(404).send({
			message: `Topic with id ${topicId} could not be found`,
		});

	const filePath = path.join(__dirname, "/data/topics/", `${topicId}.json`);

	try {
		const topic = JSON.parse(await fsPromises.readFile(filePath));
		return res.json(topic);
	} catch (e) {
		return res.json({
			message:
				"TODO: An empty topic that needs fake data " +
				e.message +
				" " +
				filePath,
		});
	}
});

app.get("/api/changes-since/:date", (req, res) =>
	res.sendFile(__dirname + "/data/changes-since.json")
);

app.get("/", (req, res) =>
	res.send(
		"OK people, move along, there's nothing to see here. Try /api/topics instead"
	)
);

app.listen(port, () =>
	console.log(`Fake CKS API is now available at http://localhost:${port}!`)
);
