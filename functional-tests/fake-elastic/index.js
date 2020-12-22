const path = require("path"),
	express = require("express"),
	fs = require("fs-extra"),
	jsonpath = require("jsonpath");

const suggestDirectory = path.join(__dirname, "data", "suggest"),
	resultsDirectory = path.join(__dirname, "data", "results"),
	autocompleteDirectory = path.join(__dirname, "data", "autocomplete");

const removeJsonFileExtension = (fileName) => path.basename(fileName, ".json");

const app = express();
const port = 9200;

// Allow us to parse request bodies as JSON: https://stackoverflow.com/a/49943829/486434
app.use(express.json());

// Response extensions for sending the fake elastic JSON responses
app.use(async (req, res, next) => {
	const sendElasticResponse = async (fileName, next, directory, type) => {
		const filePath = path.join(directory, `${fileName}.json`);
		if (await fs.pathExists(filePath)) res.sendFile(filePath);
		else next(new Error(`Couldn't find ${type} file for ${fileName}`));
	};

	res.sendSuggest = async (fileName, next) => {
		console.info(`Suggest request for ${fileName}`);
		sendElasticResponse(fileName, next, suggestDirectory, "suggest");
	};

	res.sendResults = async (fileName, next) => {
		console.info(`Results request for ${fileName}`);
		sendElasticResponse(fileName, next, resultsDirectory, "results");
	};

	res.sendAutocomplete = async (fileName, next) => {
		console.info(`Autocomplete request for ${fileName}`);
		sendElasticResponse(fileName, next, autocompleteDirectory, "autocomplete");
	};

	next();
});

// This endpoint is called twice from search client: once for results and once for suggestions
app.post("/cks/document/_search", async ({ body }, res, next) => {
	// Suggest requests are in the form {"suggest":{"suggester":{"text":"paracetmol"...
	if (body.suggest)
		return res.sendSuggest(body.suggest.suggester.text || "empty", next);

	// Look for the first query in the request document. Note: this isn't the raw
	// query term passed in: it's capitalized and pre-processed by search client
	const queryTerm = jsonpath.query(body, "$..query_string.query")[0];

	if (typeof queryTerm === "undefined") return res.sendResults("empty", next);

	// Look for a file in the results directory that matches the given query term
	const resultFileName = (await fs.readdir(resultsDirectory))
		.map(removeJsonFileExtension)
		.find((f) => new RegExp(f, "i").test(queryTerm));

	return res.sendResults(resultFileName || queryTerm, next);
});

app.post("/cks_autocomplete/typeahead/_search", async ({ body }, res, next) => {
	var query = body.query.function_score.query.match.title.query;
	return res.sendAutocomplete(query, next);
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
