# Fake CKS ElasticSearch

> A fake ElasticSearch instance with specific fake search data for use in automated tests.

## What is it?

An ExpressJS Node app that fakes out ElasticSearch. It serves pre-defined static JSON files in response to specific, [supported queries](#supported-queries). These responses are taken from ElasticSearch, and the app runs on port 9200. This means the CKS web app (and Search Client) doesn't know it's not an _actual_ Elastic instance.

## Rationale

- It allows us to write browser-based, functional tests against search scenarios.
- We don't need to spin up a heavy, full ElasticSearch instance in Docker for the automated tests.
- We don't need to be able to connect to a real ElasticSearch instance outside of our tests.
- We're in control of the fixed data, so not at the risk of failed tests due to external data changing.

## Supported queries

**Only** the following queries are supported. Using other query terms will result in errors:

- _cancer_
- _paracetmol_. Notice the intentional spelling mistake, for testing spelling correction.
- typeahead search for _diab_
- typeahead search for _ast_
- TODO: other scenarios and paging

## Usage

Run `npm ci` to install dependencies. Run `npm start` to run the app. Note: this runs on port 9200 so you won't be able to run a _real_ ElasticSearch on your machine at the same time.

## Docker

The app comes with a Dockerfile that handles everything for you - installing dependencies and running the app. It's included within the main [functional tests](../) docker-compose network by default, so you don't need to do anything.
