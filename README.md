# NICE Clinical Knowledge Summaries (CKS)

> Website for NICE Clinical Knowledge Summaries (CKS) built with Gatsby. Provides summaries of current evidence, and practical guidance, for primary care practitioners

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->
- [NICE Clinical Knowledge Summaries (CKS)](#nice-clinical-knowledge-summaries-cks)
	- [What is it?](#what-is-it)
	- [Stack](#stack)
		- [Software](#software)
		- [Architecture](#architecture)
		- [Tests](#tests)
			- [Debugging tests](#debugging-tests)
			- [Why not Enzyme?](#why-not-enzyme)
	- [:rocket: Set up](#rocket-set-up)
<!-- END doctoc -->
</details>
  
## What is it?

CKS is a microsite providing summaries of current evidence and practical guidance. It presents over 300+ topics (e.g. cough, food allergy or infertility) grouped across 25+ specialities (e.g. allergies or musculoskeletal).

It's mainly aimed at GPs, nurses, pharmacists and other primary care practitioners. CKS is used by around 450,000 users a month (as of February 2020) and is NICE's third most used service.

The content is provided by a third party, [Clarity](https://clarity.co.uk/clinical-knowledge-summaries/), commissioned by NICE. We receive the content via a JSON API provided by Clarity and use this to generate the site every month.

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

> If you're new to Gatsby, don't worry it's a well used static site generator build with React and its [documentation](https://www.gatsbyjs.org/docs/) is superb.

### Architecture

CKS is a static site, generated once per month. This is because the content feed gets updated monthly and includes the _What's New_ section, to show users what has changed month on month. Generating a static site also has the benefit of being able to generate the HTML upfront and just serve the content, without runtime processing resulting in a faster website.

The static site is generated with Gatsby, which also has the benefit of Hot Module Replacement (HMR) for faster local development.

The resulting HTML built by the static site generator is deployed to a Windows Server running IIS. This is because the HTML gets packaged and deployed along with server side C# .NET code to handle the search API endpoint. This project uses the Search Client to talk to ElasticSearch.

There are tests for the static site, and the search .NET project, and functional, browser-based tests that run via WebDriverIO. See the [functional-tests](functional-tests#readme) folder for more information on how to run these tests.

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

We've configured 2 launch configurations (see [.vscode/launch.json](.vscode/launch.json)) for running and debugging Jest test:

1. **Jest tests (all)** - runs all test, with a debugger attached
2. **Jest tests (current file)** - runs the Jest against the file currently opened file.

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

1. Install [Node 10+](https://nodejs.org/en/download/) (latest LTS version)
2. Clone this repository
3. Open the root of the repository in VS Code
4. Install dependencies from npm:
   1. `cd` into the _gatsby_ folder
   2. run `npm i` to install dependencies
5. Press _F5_ to build the gatsby site and debug in Chrome
   1. This uses the debugging built into VS Code
   2. Alternatively:
      1. run `npm start` from the _gatsby_ folder
      2. open http://localhost:8000 in a browser
