# Functional tests for CKS

> Functional, browser-based tests for NICE CKS, built with WebdriverIO

[**:rocket: Jump straight to getting started**](#rocket-set-up)

## Table of contents

- [Functional tests for CKS](#functional-tests-for-cks)
	- [Table of contents](#table-of-contents)
	- [Stack](#stack)
		- [Software](#software)
	- [:rocket: Set up](#rocket-set-up)
		- [Using npm](#using-npm)
			- [Different URLs](#different-urls)
		- [Docker](#docker)
			- [Development mode](#development-mode)
	- [Excluding tests](#excluding-tests)
	- [Running single features](#running-single-features)

## Stack

### Software

- [VS Code IDE](https://code.visualstudio.com/)
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [WebdriverIO](http://v4.webdriver.io/) v4
  - [Cucumber.js](https://github.com/cucumber/cucumber-js) for running BDD gherkin-syntax feature files
  - [Chai](https://www.chaijs.com/) for assertions
  - [wdio-cucumber-steps](https://github.com/nice-digital/wdio-cucumber-steps) for shared step definitions for Cucumber JS BDD tests in WebdriverIO
  - [Axe core](https://github.com/dequelabs/axe-core) for automatic accessibility testing
  - [Allure](https://docs.qameta.io/allure/) to generate a test report
- [Docker](https://www.docker.com/) for running the tests in TeamCity against Chrome and Firefox

> Note: we're using v4 of WebdriverIO so be sure to use the correct version of the docs at http://v4.webdriver.io/!

## :rocket: Set up

Run the tests directly on your machine [using npm](#using-npm), or via Docker.

### Using npm

Using npm will launch browsers on your local machine to run the tests. This is useful for watching the test runs to diagnose any failing tests.

1. Install Node 10+
2. Install Chrome and Firefox
3. Build the [Gatsby site](../gatsby/):
   1. `cd gatsby && npm run build`
4. Run the [web-app](../web-app/) on http://localhost:5000
   1. `cd web-app && dotnet run --project CKS.Web/CKS.Web.csproj`
5. `cd` into the _functional-tests_ folder and:
   1. Run `npm i` to install dependencies
   2. Run `npm test`

This runs the tests against the [web-app](../web-app/) running on http://localhost:5000. This is for 2 reasons:

- You get static HTML served for the HTML pages (rather than client side rendering)
- You can test the search integration

However, depending on your use case, you can run the tests against [different URLs](#different-urls).

> Note: we don't recommend running the functional tests against:
>
> - the Gatsby development site (on http://localhost:8000) because this uses pure client side rendering so the tests would need to wait for elements to exist before asserting.
> - the Gatsby build site (on http://localhost:9000) as you can't test the search integration.

#### Different URLs

Use the `-b` (or `--baseUrl`) [CLI parameter](http://v4.webdriver.io/guide/testrunner/gettingstarted.html) from WebdriverIO to override the URL for the tests.

For example, to run against the test environment:

```sh
npm test -- -b https://test.cks.nice.org.uk/
```

### Docker

We run the tests in Docker on TeamCity because it allows us to spin up a self-contained application, and selenium grid with both Chrome and Firefox. You can run this same stack locally inside Docker.

It can be harder to debug tests running inside Docker as you can't watch the tests run in the browser, but we do save error screenshots and logs into the docker-output folder for debugging.

1. Install Node 10+
2. Build the [Gatsby site](../gatsby/):
   1. `cd gatsby && npm run build`
3. Install [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download)
4. Publish the [CKS.Web web-app](../web-app/) into the _web-app/publish_ folder:
   1. `cd web-app && dotnet publish CKS.Web/CKS.Web.csproj -o publish`
5. Install Docker
6. Open bash and `cd` into the _functional-tests_ folder
7. Run `docker-compose build`
   1. This downloads all the required images from Docker
   2. So it takes a while but it will cache everything so will be quicker next time
8. Run `./docker-run.sh`
   1. This builds the docker network, runs the tests and copies outputs in the _docker-output_ folder.

> View the [docker-compose.yml](docker-compose.yml) file to understand the structure of the Docker network and the links between containers.

#### Development mode

Using _docker-run.sh_ is great for running the tests one off inside Docker, but it creates the Docker network then destroys everything after the test run. This means slow cycle times for chaning feature files (or step definitions) and re-running the test(s).

Instead, we can run the following command:

```sh
docker-compose up -d && docker-compose run test-runner bash
```

This runs the docker network in 'detached' mode, which leaves the containers running. It then runs bash against the test runner container. This allows us to then run the tests from within the Docker network, but the CKS web app runs on http://cks-web-app:8080 inside Docker so we have a simple npm alias command to run the tests within Docker:

```sh
npm run test:docker
```

Examine the scripts within [package.json](package.json) to see how the URL is being overriden within this command.

The whole functional-tests folder is mounted as a volume in the test-runner container. This means any screenshots generated in the case of an error are saved into the screenshots folder, and these are available on the host machine.

> Note: run `exit` to escape from bash inside the test-runner container, and run `docker-compose down` to stop the Docker network.

## Excluding tests

Exclude tests by using the `@pending` [cucumber tag](https://github.com/cucumber/cucumber/wiki/Tags).

## Running single features

To run a single feature file, use the following command:

```sh
npm test -- --spec ./features/guidance-list.feature
```

> Note: you can pass in multiple files, separated by a comma.

Or you can use a keyword to filter e.g.:

```sh
npm test -- --spec homepage
```

Finally, if you've grouped your specs into suites you can run and individual suite with:

```sh
npm test -- --suite homepage
```

See [organizing test suites](http://v4.webdriver.io/guide/testrunner/organizesuite.html) in the WebdriverIO docs for more info.
