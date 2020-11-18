const path = require("path"),
	express = require("express"),
	fs = require("fs-extra"),
	jsonpath = require("jsonpath");

const suggestDirectory = path.join(__dirname, "data", "suggest"),
	resultsDirectory = path.join(__dirname, "data", "results");

const removeJsonFileExtension = (fileName) => path.basename(fileName, ".json");

const app = express();
const port = 9200;

// Allow us to parse request bodies as JSON: https://stackoverflow.com/a/49943829/486434
app.use(express.json());

// This endpoint is called twice from search client: once for results and once for suggestions
app.post("/cks/document/_search", async ({ body }, res, next) => {
	// Suggest requests are in the form {"suggest":{"suggester":{"text":"paracetmol"...
	const { suggest } = body;
	if (suggest) {
		const suggestFilePath = path.join(
			suggestDirectory,
			suggest.suggester.text + ".json"
		);

		return (await fs.pathExists(suggestFilePath))
			? res.sendFile(suggestFilePath)
			: next(new Error(`Couldn't find suggest file at ${suggestFilePath}`));
	}

	// Look for the first query in the request document. Note: this isn't the raw
	// query term passed in: it's capitalized and pre-processed by search client
	const queryTerm = jsonpath.query(body, "$..query_string.query")[0];

	// Look for a file in the results directory that matches the given query term
	const resultFileName = (await fs.readdir(resultsDirectory))
		.map(removeJsonFileExtension)
		.find((f) => new RegExp(f, "i").test(queryTerm));

	return resultFileName
		? res.sendFile(path.join(resultsDirectory, resultFileName + ".json"))
		: next(new Error(`Couldn't find results file for query '${queryTerm}'`));
});

// 404 handler
app.use(function (req, res, next) {
	res.status(404).send("Sorry can't find that!");
});

// Error handler
app.use(function (err, req, res, next) {
	console.error(err);
	res.status(500).send(`Server error: ${err.message} ${err.stack}`);
});

app.listen(port, () => {
	console.log(`Fake elastic search running at http://localhost:${port}`);
});
