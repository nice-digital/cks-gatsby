const express = require("express"),
	path = require("path"),
	fsPromises = require("fs").promises;

const replacementToken = "REPLACE_ON_SERVE",
	port = process.env.PORT || 8001,
	fakeAuthHeaderValue = "abc123";

const allTopicsResponse = require("./data/topics.json");

const app = express();

app
	.get("/", (req, res) =>
		res.send(
			"OK people, move along, there's nothing to see here. Try /api/topics instead, and make sure you authenticate!"
		)
	)
	// Fake authentication to mimick the real API
	.use((req, res, next) => {
		if (!req.headers["ocp-apim-subscription-key"])
			return res.status(401).json({
				statusCode: 401,
				message:
					"Access denied due to missing subscription key. Make sure to include subscription key when making requests to an API.",
			});
		else if (req.headers["ocp-apim-subscription-key"] !== fakeAuthHeaderValue)
			return res.status(401).json({
				statusCode: 401,
				message:
					"Access denied due to invalid subscription key. Make sure to provide a valid key for an active subscription.",
			});

		return next();
	})
	.get("/api/topics", (req, res) => res.json(allTopicsResponse))
	.get("/api/topic/:topicId", async (req, res) => {
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

			if (
				topic.topicHtmlObjects.length === 1 &&
				topic.topicHtmlObjects[0].htmlStringContent === replacementToken
			) {
				topic.topicHtmlObjects[0].htmlStringContent = [
					"<p>This is an empty sample topic for local development. It has a single chapter so we don't have to generate 1000s of pages, which speeds up development</p>",
					`<p>Edit the contents of /fake-api/data/topics/${topicId}.json if you need more fake content to test with.</p>`,
					"<p><strong>Please do not copy real content from the feed into these files!</strong>. Asthma is the only publically available topic, so use that for testing or create fake content.</p>",
				].join("\n");
			}

			return res.json(topic);
		} catch (e) {
			return res.json({
				id: [`The value '${topicId}' is not valid.`],
			});
		}
	})
	.get("/api/changes-since/:date", (req, res) =>
		res.sendFile(__dirname + "/data/changes-since.json")
	)
	.use((req, res, next) =>
		res.status(404).json({
			statusCode: 404,
			message: "Resource not found",
		})
	);

app.listen(port, () =>
	console.log(`Fake CKS API is now available at http://localhost:${port}!`)
);
