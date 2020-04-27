# Fake API for CKS

> Fake of the CKS API for local development

[**:rocket: Jump straight to getting started**](#rocket-set-up)

## Table of contents

- [Fake API for CKS](#fake-api-for-cks)
	- [Table of contents](#table-of-contents)
	- [Stack](#stack)
	- [:rocket: Set up](#rocket-set-up)
		- [Command line setup](#command-line-setup)
	- [Endpoints](#endpoints)

## Stack

- Node 10+
- Express

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

## Endpoints

All topics (index)
http://localhost:7000/api/topics

Asthma
http://localhost:7000/api/topic/2a0a90e6-1c4e-4b6a-9ce2-3379dd122594

> NOTE: Free topic TODO

http://localhost:7000/api/changes-since/a
