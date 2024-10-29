# NICE Clinical Knowledge Summaries (CKS)

> Website for NICE Clinical Knowledge Summaries (CKS). Provides summaries of current evidence, and practical guidance, for primary care practitioners

[**:rocket: Jump straight to getting started**](#rocket-set-up)

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
	- [What is it?](#what-is-it)

- [What is it?](#what-is-it)
- [Project structure](#project-structure)
- [Stack](#stack)
  - [Software](#software)
- [Architecture](#architecture)
- [Search](#search)
  - [ElasticSearch](#elasticsearch)
- [:rocket: Set up](#rocket-set-up)
- [Good to know](#good-to-know)
  - [Further info](#further-info)
  - [Environments](#environments)
  - [Top 5 common issues affecting users](#top-5-common-issues-affecting-users)
  - [Regenerate the Table of Contents](#regenerate-the-table-of-contents)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>
  
## What is it?

CKS is a microsite providing summaries of current evidence and practical guidance. It presents over 300+ topics (e.g. cough, food allergy or infertility) grouped across 25+ specialities (e.g. allergies or musculoskeletal).

It's mainly aimed at GPs, nurses, pharmacists and other primary care practitioners. CKS is used by around 450,000 users a month (as of February 2020) and is NICE's third most used service.

The content is provided by a third party, [Clarity](https://clarity.co.uk/clinical-knowledge-summaries/), commissioned by NICE. We receive the content via a JSON API provided by Clarity and use this to generate the site every month.

## Project structure

| Folder                                      | Purpose                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| [fake-api](fake-api#readme)                 | A local, fake API with limited content for faster local development                 |
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
- [Gatsby v2](https://www.gatsbyjs.com/docs) and [React](https://reactjs.org/) for static site generation
- [WebdriverIO v4](http://v4.webdriver.io/) for browser-based functional tests

## Architecture

CKS is a static site, generated once per month. This is because the content feed gets updated monthly and includes the _What's New_ section, to show users what has changed month on month. Generating a static site also has the benefit of being able to generate the HTML upfront and just serve the content, without runtime processing resulting in a faster website.

The static site is generated with Gatsby, which also has the benefit of Hot Module Replacement (HMR) for faster local development.

The resulting HTML built by the static site generator is packaged and deployed within the .NET Core web application. This web app contains server side C# .NET code to handle the search API endpoint, and uses the Search Client to talk to ElasticSearch.

There are tests for the static site, the search .NET project, and browser-based, [functional tests](functional-tests#readme) that run via WebDriverIO.

## Search

The cks-gatsby webapp uses the NICE.Search Nuget package to query the CKS ElasticSearch index.

The NICE.Search Nuget packages uses .Net Standard and is configured in the appsettings.json.

Search results come from ElasticSearch (ES), provided by the [SearchClient NuGet package](https://github.com/nice-digital/search/tree/master/Client). They are served to the front-end as a JSON response at the _api/search_ endpoint via an MVC controller in the web-app project. SearchController references and calls the SearchClient NuGet package internally. The search results page is then rendered client-side, hence the results being at _/search?q=..._.

> You can see the JSON response that's used for client-side rendering by visiting https://localhost:5000/api/search?q=test in your browser.

### ElasticSearch

There are two ES instances available, one on the NHSEVIRT domain and one in AWS.

- You will only be able to verify search functionality if you are connected to either the pink cable, the IM&T wi-fi or have a local elastic search instance set up.
- You may need to add dev.es.nice.org.uk to your hosts file if you are unable to resolve the ES server using DNS
- Make the following changes in _\cks-gatsby\web-app\CKS.Web\appsettings.json_ **(don't check in!)**:

  - set `https://test-search-api.nice.org.uk` for `SearchApiUrl` whilst developing
  - set `https://search-api.nice.org.uk` for `SearchApiUrl` for deploying to live servers at AWS.

  If you are not on the pink cable or NICE network see [this](https://niceuk.sharepoint.com/sites/Search_-_DIT_Service/SitePages/Elasticsearch-7-upgrade.aspx) document for setting up local elasticsearch indexes for the searchclient nuget to use. Also there are [snapshots](https://niceuk.sharepoint.com/sites/Digital_Information_and_Technology/_layouts/15/Doc.aspx?sourcedoc={de4304ac-d35d-49d5-b83b-11c74f5373c7}&action=edit&wd=target%28Elasticsearch.one%7Cec3ed309-4205-4b91-85c2-5a8c99359783%2FSnapshots%7Cce9480d5-70ba-4455-a7c3-05274d6f036d%2F%29&wdorigin=NavigationUrl) available to use.

## :rocket: Set up

The easiest way to get the project running is:

1. Install [Node 10+](https://nodejs.org/en/download/) (latest LTS version)
2. Clone this repository
3. Open the root of the repository in VS Code
   1. Install recommended extensions when prompted
4. Install dependencies:
   1. Open the command palette (_Ctrl+Shift+P_) in VS Code, then:
   2. Run 'npm: Install Dependencies' (and choose 'Run all commands listed below')
   3. Run '.NET: Restore Project' for CKS.Web
5. Go to the 'Run and Debug' panel (_Ctrl+Shift+D_) in VS Code
6. Run `Launch CKS`

Launching the app via `Launch CKS` does the following:

1. http://localhost:5000/ - Builds and runs the .NET core web app in the background
2. http://localhost:8001/ - Creates a local, fake CKS api
3. http://localhost:8000/ - Builds the Gatsby static site then launches it in Chrome once it's built
4. Proxies http://localhost:8000/api/search (in the Gatsby site) to http://localhost:5000/api/search (in the .NET core app)

It also attached debuggers so you can add break points in VS Code for the Gatsby Node processes, the Gatsby React components, the fake API and the .NET web app classes.

> Note: there are more granular ways to run each part of the project, either via an IDE or via the command line. See each sub-folders's readme for more details.

## Good to know

### Further info

See the [CKS Sharepoint site](https://niceuk.sharepoint.com/sites/CKS)

### Environments

| Environment | URL                           |
| ----------- | ----------------------------- |
| Local       | https://local-cks.nice.org.uk |
| Live        | https://cks.nice.org.uk/      |

### Top 5 common issues affecting users

> An explanation of the top 5 common issues (if applicable) that we as a development team might encounter with this project

### Regenerate the Table of Contents

For further information about the recommended ReadMe structure plus a 'how to' for regenerating the table of contents, follow the instructions in [DIT Engineering - ReadMes](https://niceuk.sharepoint.com/sites/DIT_Engineering/SitePages/Readmes.aspx)
