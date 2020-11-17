const path = require("path"),
	express = require("express");

const app = express();
const port = 9200;

// Allow us to parse request bodies as JSON: https://stackoverflow.com/a/49943829/486434
app.use(express.json());

app.post("/cks/document/_search", (req, res) => {
	const { body } = req;

	console.log({ body });

	res.sendFile(path.join(__dirname, "data", "paracetmol.json"));
});

app.listen(port, () => {
	console.log(`Fake elastic search running at http://localhost:${port}`);
});
