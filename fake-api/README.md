# Fake API for CKS

> Fake of the CKS API for local development

[**:rocket: Jump straight to getting started**](#rocket-set-up)

## Table of contents

- [Fake API for CKS](#fake-api-for-cks)
	- [Table of contents](#table-of-contents)
	- [Stack](#stack)
	- [:rocket: Set up](#rocket-set-up)
		- [Command line setup](#command-line-setup)
			- [Commands](#commands)
	- [Authentication](#authentication)
	- [Endpoints](#endpoints)
		- [All topics](#all-topics)
		- [Individual topic](#individual-topic)
		- [Changes since](#changes-since)
	- [Postman](#postman)

## Stack

- Node 10+
- Express
- Postman (optional)

## :rocket: Set up

1. Install [Node 10+](https://nodejs.org/en/download/) (latest LTS version)
2. Clone this repository
3. Open the root of the repository in VS Code
   1. Install recommended extensions when prompted
4. Install dependencies:
   1. Open the command palette (_Ctrl+Shift+P_) in VS Code, then:
   2. Run 'npm: Install Dependencies'
   3. Run 'fake-api - Install' from the given options
5. Go to the 'Run and Debug' panel (_Ctrl+Shift+D_) in VS Code
6. Run `Fake API`
   1. Or, run `Fake API` from the debug button in the status bar

### Command line setup

Run the following commands to install dependencies and run the fake API:

```sh
# Check you have Node >= 10
node -v
# CD into the correct directory
cd fake-api
# Install depdendencies
npm ci
# Run the express server
npm start
# Open http://localhost:7000 in a browser
```

#### Commands

The above command line example uses `npm start` to run the API. Run `npm run debug` instead for debugging. This open a debug port on 9230. This is what the VSCode launch config will connect to for debugging.

See .vscode/launch.json in the root to see the port being used.

## Authentication

The real API uses a HTTP header to do authentication. The fake API mimicks this behaviour, with a simple password. This is useful for testing that the Gatsby source plugin is correctly sending the auth header for API requests.

Use the value _abc123_ for the header _ocp-apim-subscription-key_.

## Endpoints

The following endpoints are available within the API (both real and fake):

### All topics

http://localhost:7000/api/topics

Serves an index file of all 370+ topics, with only partial, top level fields like title.

Example request:

```sh
curl --location --request GET 'http://localhost:7000/api/topics' --header 'ocp-apim-subscription-key: abc123'
```

### Individual topic

http://localhost:7000/api/topic/<topic id>

Serves a full single topic, with all the chapter HTML information. For example Asthma is available at http://localhost:7000/api/topic/2a0a90e6-1c4e-4b6a-9ce2-3379dd122594.

> NOTE: Asthma is the only freely available topic on Clarity's Prodigy so it's the only full 'real' topic we include in the fake feed by default.

Other topics apart from Asthma just serve a single, dummy chapter. This means quicker local development as you don't have to build 1000s of pages, but it still means you get a full list of topics. Edit the json files in data/topics to add more fake chapters and HTML content.

Example request:

```sh
curl --location --request GET 'http://localhost:7000/api/topic/2a0a90e6-1c4e-4b6a-9ce2-3379dd122594' --header 'ocp-apim-subscription-key: abc123'
```

### Changes since

http://localhost:7000/api/changes-since/<date>

Returns a list of changes to topics since the given date. The must be in an ISO 8601 format e.g. 2019-10-01T00:00:00.000Z.

Example request:

```sh
curl --location --request GET 'http://localhost:7000/api/changes-since/2019-10-01T00:00:00.000Z' --header 'ocp-apim-subscription-key: abc123'
```

## Postman

[Postman](https://www.postman.com/) is a great tool for inspecting the API if you're consuming any API changes.

Each endpoint above includes a curl example which can be easily imported into Postman (Import -> Paste Raw Text).

Alternatively, save the following JSON to a file on your machine, and import into Postman.

> Note: you'll need to set up variables for `CKSApiKey` and `CKSApiBaseUrl` before you can use it. For example set `CKSApiBaseUrl` to http://localhost:7000/api/ and `CKSApiBaseUrl` to abc123.

<details>
  <summary>Postman Collection v2.1 JSON export</summary>
  
```json
{
	"info": {
		"_postman_id": "3436e853-6577-4a3a-b951-e6d54007c1ee",
		"name": "CKS API",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Topics",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{CKSApiBaseUrl}}topics",
					"host": ["{{CKSApiBaseUrl}}topics"]
				},
				"description": "Gets a list of topics from the Clarity CKS API"
			},
			"response": []
		},
		{
			"name": "Topic details",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{CKSApiBaseUrl}}topic/2a0a90e6-1c4e-4b6a-9ce2-3379dd122594",
					"host": ["{{CKSApiBaseUrl}}topic"],
					"path": ["2a0a90e6-1c4e-4b6a-9ce2-3379dd122594"]
				},
				"description": "Gets a list of topics from the Clarity CKS API"
			},
			"response": []
		},
		{
			"name": "Changes since",
			"request": {
				"method": "GET",
				"header": [],
				"url": {
					"raw": "{{CKSApiBaseUrl}}changes-since/2019-10-01T00:00:00.000Z",
					"host": ["{{CKSApiBaseUrl}}changes-since"],
					"path": ["2019-10-01T00:00:00.000Z"]
				}
			},
			"response": []
		}
	],
	"auth": {
		"type": "apikey",
		"apikey": [
			{
				"key": "value",
				"value": "{{CKSApiKey}}",
				"type": "string"
			},
			{
				"key": "key",
				"value": "ocp-apim-subscription-key",
				"type": "string"
			}
		]
	},
	"event": [
		{
			"listen": "prerequest",
			"script": {
				"id": "541f6ad8-aebb-4fd4-9c8d-3c318ff82edf",
				"type": "text/javascript",
				"exec": [
					"pm.request.headers.upsert({key: 'Accept', value: 'application/json' }) "
				]
			}
		}
	],
	"variable": [
		{
			"id": "4406c646-5c3c-4b34-902c-b5287a584aa2",
			"key": "CKSApiKey",
			"value": "",
			"type": "string"
		}
	]
}
```
</details>
