# NICE Clinical Knowledge Summaries (CKS)

> Website for NICE Clinical Knowledge Summaries (CKS). Provides summaries of current evidence, and practical guidance, for primary care practitioners

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->
- [NICE Clinical Knowledge Summaries (CKS)](#nice-clinical-knowledge-summaries-cks)
	- [What is it?](#what-is-it)
	- [Project structure](#project-structure)
	- [Stack](#stack)
		- [Software](#software)
	- [Architecture](#architecture)
	- [:rocket: Set up](#rocket-set-up)
<!-- END doctoc -->
</details>
  
## What is it?

CKS is a microsite providing summaries of current evidence and practical guidance. It presents over 300+ topics (e.g. cough, food allergy or infertility) grouped across 25+ specialities (e.g. allergies or musculoskeletal).

It's mainly aimed at GPs, nurses, pharmacists and other primary care practitioners. CKS is used by around 450,000 users a month (as of February 2020) and is NICE's third most used service.

The content is provided by a third party, [Clarity](https://clarity.co.uk/clinical-knowledge-summaries/), commissioned by NICE. We receive the content via a JSON API provided by Clarity and use this to generate the site every month.

## Project structure

| Folder                                      | Purpose                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| [gatsby](gatsby#readme)                     | Static site built with React and Gatsby                                             |
| [web-app](web-app#readme)                   | Web application that wraps the static site and provides the search results endpoint |
| [functional-tests](functional-tests#readme) | Browser-based functional tests in WebdriverIO                                       |

> Note: Each of these folders has its own readme with detailed setup steps etc

## Stack

This is the high level stack. Each of the sub-projects (gatsby, web-app and functional-tests) has its own readme with more detailed stack.

### Software

- [VS Code IDE](https://code.visualstudio.com/) for Gatsby
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [Visual Studio 2019](https://visualstudio.microsoft.com/vs/) for the search endpoint web app
- [.NET Core 3](https://dotnet.microsoft.com/) for the search endpoint web app
- [Gatsby v2](https://www.gatsbyjs.org/) and [React](https://reactjs.org/) for static site generation
- [WebdriverIO v4](http://v4.webdriver.io/) for browser-based functional tests

## Architecture

CKS is a static site, generated once per month. This is because the content feed gets updated monthly and includes the _What's New_ section, to show users what has changed month on month. Generating a static site also has the benefit of being able to generate the HTML upfront and just serve the content, without runtime processing resulting in a faster website.

The static site is generated with Gatsby, which also has the benefit of Hot Module Replacement (HMR) for faster local development.

The resulting HTML built by the static site generator is packaged and deployed within the .NET Core web application. This web app contains server side C# .NET code to handle the search API endpoint, and uses the Search Client to talk to ElasticSearch.

There are tests for the static site, the search .NET project, and browser-based, [functional tests](functional-tests#readme) that run via WebDriverIO.

## :rocket: Set up

The easiest way to get the project running is:

1. Install [Node 10+](https://nodejs.org/en/download/) (latest LTS version)
2. Clone this repository
3. Open the root of the repository in VS Code
   1. Install recommended extensions when prompted
4. Install dependencies:
   1. Open the command palette (_Ctrl+Shift+P_) in VS Code, then:
   2. Run 'npm: Install Dependencies'
   3. Run '.NET: Restore Project' for CKS.Web
5. Go to the 'Run and Debug' panel (_Ctrl+Shift+D_) in VS Code
6. Run `Launch CKS`

Launching the app via `Launch CKS` does the following:

1. Builds and runs the .NET core web app in the background on http://localhost:5000/
2. Creates a local, fake CKS api at http://localhost:7000/
3. Builds the Gatsby static site then launches it in Chrome http://localhost:8000/ once it's built
4. Proxies http://localhost:8000/api/search (in the Gatsby site) to http://localhost:5000/api/search (in the .NET core app)

It also attached debuggers so you can add break points in VS Code for the Gatsby Node processes, the Gatsby React components and the .NET web app classes.

> Note: there are more granular ways to run each part of the project, either via an IDE or via the command line. See each sub-folders's readme for more details.
