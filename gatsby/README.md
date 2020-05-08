# Gatsby site for CKS

> Static website for NICE Clinical Knowledge Summaries (CKS) built with Gatsby and React

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->
- [Gatsby site for CKS](#gatsby-site-for-cks)
	- [Stack](#stack)
		- [Software](#software)
		- [Tests](#tests)
			- [Debugging tests](#debugging-tests)
			- [Why not Enzyme?](#why-not-enzyme)
	- [:rocket: Set up](#rocket-set-up)
		- [Other commands](#other-commands)
	- [Source plugin](#source-plugin)
		- [Production API](#production-api)
<!-- END doctoc -->
</details>

## Stack

### Software

- [VS Code IDE](https://code.visualstudio.com/)
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [Gatsby](https://www.gatsbyjs.org/) and [React](https://reactjs.org/) for static site generation
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Prettier](https://prettier.io/) for code formatting
- [ESLint](https://eslint.org/) for JavaScript/TypeScripting linting
- [Jest](https://jestjs.io/) for JS unit testing
  - With [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [node-fetch](https://www.npmjs.com/package/node-fetch) for loading data

> If you're new to Gatsby, don't worry: it's a well used static site generator build with React and its [documentation](https://www.gatsbyjs.org/docs/) and community is superb.

### Tests

We use [Jest](https://jestjs.io/) for JS unit testing with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) within the Gatsby static site.

To run the tests:

1. `cd gatsby` in a terminal to get into the _gatsby_ folder
2. Run `npm test` to run the jest tests
   1. Or, run `npm run test:watch` to run the tests and watch for changes to files, to re-run the tests
   2. Or, run `npm run test:coverage` to run the tests and output a _coverage_ folder with an lcov report.

> Running tests in watch mode via `npm run test:watch` is most useful when developing locally.

If you prefer to run (and debug) the tests via an IDE (VS Code), then read on:

#### Debugging tests

We've configured 3 launch configurations (see [.vscode/launch.json](.vscode/launch.json)) for running and debugging Jest test:

1. **Jest tests (all)** - runs all test, with a debugger attached
2. **Jest tests (current file)** - runs the Jest against the file currently opened file.
3. **Jest tests (watch current file)** - runs the Jest against the file currently opened file and watches for changes.

Run these from the 'Run and Debug' panel (_Ctrl+Shift+D_) in VS Code:

1. Choose the relevent launch configuration from the menu
2. Press the green play button (or press _F5_).

> Note: these launch configurations are based on [Microsoft's "Debugging tests in VS Code" recipe](https://github.com/microsoft/vscode-recipes/tree/master/debugging-jest-tests).

#### Why not Enzyme?

(And why React Testing Library instead?)

The NICE Digital Architecture Forum previously [approved use of Enzyme](https://github.com/nice-digital/technology-radar/commit/d91648f10c68457bd3a6922abd3441fbd8bd9f4f#diff-e19433e580cdcbfea7a30b748229225eR16) as part of our front-end tech stack, and it's used within a few projects.

However, Enzyme is set up in a way to focus on internals of React components (props/state) rather than the DOM and what users end up seeing. So we like the philosophy of React Testing Library and subscribe to the guiding principle:

> The more your tests resemble the way your software is used, the more confidence they can give you.

## :rocket: Set up

The easiest way to run the Gatsby site is via the _Launch CKS_ debug command in VS Code. This is because it runs the other parts of the project too, not just the Gatsby site. See the readme in the repository root for more info.

However, to run the the Gatsby site on its own from the command line:

1. Install [Node 10+](https://nodejs.org/en/download/) (latest LTS version)
2. Clone this repository
3. Open the root of the repository in VS Code
4. Install dependencies from npm:
   1. Run 'npm: Install Dependencies' from the VS Code command palette (_Ctrl+Shift+P_)
   2. Or run `cd gatsby && npm ci` on the command line
5. Press _F5_ to build the gatsby site and debug in Chrome
   1. This uses the debugging built into VS Code
   2. Alternatively:
      1. run `npm start` from the _gatsby_ folder
      2. open http://localhost:8000 in a browser

### Other commands

There are various other commands you can run in a terminal from the _gatsby_ folder:

| Script                  | What does it do                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `npm start`             | Runs the Gatsby site in development mode                                           |
| `npm run build`         | Builds the production build of the Gatsby site into the _public_ folder            |
| `npm run serve`         | Serves the built Gatsby files from `npm run build` on http://localhost:9000/       |
| `npm run cb`            | Copies useful Gatsby info to the clipboard, useful for reporting defects on GitHub |
| `npm test`              | Runs Jest tests                                                                    |
| `npm run test:watch`    | Runs Jest tests and watches for file changes to re-run tests                       |
| `npm run test:coverage` | Runs Jest tests and outputs coverage                                               |
| `npm run lint`          | Runs prettier, eslint and typechecking                                             |
| `npm run prettier`      | Checks files for codeformatting issues using Prettier                              |
| `npm run prettier:fix`  | Runs prettier and fixes any code formatting issues                                 |
| `npm run lint:ts`       | Lints TypeScript and Javacript files using ESLint                                  |
| `npm run lint:ts:fix`   | Fixes any linting errors using ESLint                                              |
| `npm run typecheck`     | Typechecks the TypeScript files                                                    |

## Source plugin

Gatsby sites get their data via source plugins. Source plugins fetch data from somewhere (e.g. an API, database, filesystem etc) and turn them into Gatsby nodes. These nodes can then be queried via GraphQL inside Gatsby React components. Follow [part 5 of the Gatsby tutorial ('Source Plugins')](https://www.gatsbyjs.org/tutorial/part-five/) if you're new to sourcing data in Gatsby.

In the case of CKS, the source data comes from the API provided by Clarity. The data fetching and mapping to Gatsby nodes is handled via a custom source plugin. This gives a nice separation of the data loading logic from the page generation logic. The Gatsby docs has a useful section on ['Sourcing from Private APIs'](https://www.gatsbyjs.org/docs/sourcing-from-private-apis/).

**View the [custom source plugin (_gatsby-source-cks_)](plugins/gatsby-source-cks) folder for more information.**

### Production API

The source plugin (see above) points to the local, fake API (no http://lcaolhost:7000) by default. Set the following environment variables to point to a different URL:

- `API_BASE_URL`
- `API_KEY`

Create a _.env.development_ file (for local development) or _.env.production_ file (for the production build) in this _gatsby_ folder to set these environment variables.

> Note: these files are deliberately ignore from git

For example, create a _.env.production_ file pointing to the live API to create a live-like production buil via `npm run build`:

```
API_KEY=xyzetc
API_BASE_URL=https://whatever
```

> Note: you can get the live API values from the TeamCity build parameters.
