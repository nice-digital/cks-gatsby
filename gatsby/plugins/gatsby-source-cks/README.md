# Gatsby source plugin for CKS

> Custom source plugin for Gatsby to retrieve data from the CKS API and turn it into Gatsby nodes

- [Gatsby source plugin for CKS](#gatsby-source-plugin-for-cks)
	- [:rocket: Quick setup](#rocket-quick-setup)
	- [What is a source plugin?](#what-is-a-source-plugin)
	- [CKS source plugin](#cks-source-plugin)
		- [Plugin usage](#plugin-usage)
		- [Configuration](#configuration)
		- [Data fetching](#data-fetching)
			- [Authentication](#authentication)
		- [GraphQL node types](#graphql-node-types)
		- [GraphQL queries](#graphql-queries)

## :rocket: Quick setup

This readme contains background and useful information for the source plugin. This is recommended to read before working on CKS, however if you're impatient:

Follow these steps to start querying the data:

- Run the Gatsby site following the instructions in the root
- Open http://localhost:8000/___graphql in a browser to view the GraphiQL explorer.

GraphiQL is an browser-based IDE for GraphQL queries that's built in to Gatsby. Read the [_Introducing GraphiQL_](https://www.gatsbyjs.org/docs/running-queries-with-graphiql/) page on the Gatsby documentation for more information.

## What is a source plugin?

Gatsby sites get their data via source plugins. Source plugins fetch data from somewhere (e.g. an API, database, filesystem etc) and turn them into Gatsby nodes. These nodes can then be queried via GraphQL inside Gatsby React components. Follow [part 5 of the Gatsby tutorial ('Source Plugins')](https://www.gatsbyjs.org/tutorial/part-five/) if you're new to sourcing data in Gatsby and see [GraphQL & Gatsby](https://www.gatsbyjs.org/docs/graphql/) if you're new to GraphQL.

## CKS source plugin

The source plugin for CKS is a custom one (_gatsby-source-cks_). The Gatsby docs has a useful section on ['Sourcing from Private APIs'](https://www.gatsbyjs.org/docs/sourcing-from-private-apis/) which describes how to write a custom plugin to source data from an API.

Our custom source plugin handles data fetching (from the CKS JSON API) and mapping this data to Gatsby nodes (for querying via GraphQL). It _doesn't_ create pages: this gives a very clear separation of the two main components of the Gatsby build:

- data loading logic (via this plugin: gatsby-source-cks)
- website page generation logic (via the Gatsby site - see the _gatsby_ folder in the repo root).

### Plugin usage

Add the plugin to _gatsby-config.js_ in the parent Gatsby project:

```diff
module.exports = {
	plugins: [
+		"gatsby-source-cks",
	],
};
```

> Note: this is already configured, this is just showing you how it gets referenced, for info!

There's no need to install anything else. Gatsby loads local plugins automatically, see [Loading Plugins from Your Local Plugins Folder](https://www.gatsbyjs.org/docs/loading-plugins-from-your-local-plugins-folder/) in the Gatsby docs.

The plugin gets its dependencies from the parent gatsby folder. This because it makes installing dependencies easier - you don't have to run `npm i` in both folders, just the parent folder. This works because of the way that Node resolves modules (see [Loading from node_modules Folders](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders) in the Node docs).

### Configuration

The plugin has the following configuration options

- `apiKey` {String} e.g. "abc123"
- `apiBaseUrl` {String} e.g. "http://localhost:7000/api"
- `changesSinceDate` {Date} e.g. "2020-04-30"

An example configuration might look like this:

```diff
module.exports = {
	plugins: [
+		{
+			resolve: `gatsby-source-cks`,
+			options: {
+				apiKey: process.env.API_KEY || "abc123",
+				apiBaseUrl: process.env.API_BASE_URL || "http://localhost:7000/api",
+				changesSinceDate: new Date(),
+			},
+		},
	],
};
```

### Data fetching

In the case of CKS, the source data comes from the API provided by Clarity. This is fetched from the API using [`node-fetch`](https://github.com/node-fetch/node-fetch), a 'light-weight module that brings `window.fetch` to Node.js'.

The live API has all 380+ topics, with all their HTML content. Loading all this data, and transforming it into nodes can take a while which makes local development cycles slower. Use the fake CKS API on http://localhost:7000 instead for faster local development: see the _fake-api_ folder in the root of this repository. This serves a subset of content from local files so is a _lot_ quicker to both load content and to generate pages.

> Note: this is a public repository so **be careful** not to commit or expose the API key for the live CKS API.

#### Authentication

Authentication for the API (both live and fake) requires an authentication header. This is automatically sent with the requests to the API, as long as the `apiKey` config option is set (see [configuration](#configuration) above).

### GraphQL node types

The plugin downloads all the data from the CKS API and creates the following 4 node types for querying in GraphQL:

- `CksTopic` - A full topic object, taken from the _/topic/guid_ endpoint in the API
- `CksChapter` - the nested chapters within a topic, taken from the `topicHtmlObjects` API field
- `CksSpeciality` - a clinical speciality that groups topics together, for example _Injuries_ or _Musculoskeletal_
- `CksChange` - a monthly change or update to a topic. Taken from the _changes-since_ API endpoint.

### GraphQL queries

These nodes can then be [queried in GraphQL in Gatsby](https://www.gatsbyjs.org/docs/running-queries-with-graphiql/). For example run the following query to select:

- all topics with a few key fields
- all specialities, with their topics:

```graphql
{
  allCksTopic {
    nodes {
      id
      topicId
      topicName
      slug
    }
  }
  allCksSpeciality {
    nodes {
      id
      name
      slug
      topics {
        id
        topicId
        topicName
        slug
      }
    }
  }
}
```

Or [open this 'all topics' query in GraphiQL](http://localhost:8000/___graphql?query=%7B%0A%20%20allCksTopic%20%7B%0A%20%20%20%20nodes%20%7B%0A%20%20%20%20%20%20topicName%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A)

> Note: these nodes and their fields are all documented via our custom GraphQL schema, so descriptions show up in the GraphiQL explorer.
