# Web application wrapper and search endpoint for CKS

> .NET Core 3 web application for NICE Clinical Knowledge Summaries (CKS) to host the static site generated via Gatsby and to serve a search API endpoint

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->

- [Web application wrapper and search endpoint for CKS](#web-application-wrapper-and-search-endpoint-for-cks)
	- [Stack](#stack)
		- [Software](#software)
	- [Deploying to IIS](#deploying-to-iis)
	- [HTTP compression](#http-compression)
	- [Tests](#tests)
		- [Running the tests](#running-the-tests)
			- [From VSCode](#from-vscode)
			- [From command line](#from-command-line)

<!-- END doctoc -->
</details>

## Stack

### Software

- [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3](https://dotnet.microsoft.com/)
- [xUnit](https://xunit.net/) for tests
  - With [Moq](https://github.com/moq/moq4) for mocking
  - And [Shouldly](https://github.com/shouldly/shouldly) for assertions
- [IIS Compression module](https://docs.microsoft.com/en-us/iis/extensions/iis-compression/iis-compression-overview) for Brotli and gzip HTTP compression

## Deploying to IIS

Running the web app locally for development will use either Kestrel or IIS Express by default.

Follow these steps to be able to run the app in IIS:

- [Enable dynamic compression for IIS](https://docs.microsoft.com/en-us/iis/configuration/system.webserver/httpcompression/#windows-vista-or-windows-7)
- [Download and install Microsoft IIS Compression (x64)](https://docs.microsoft.com/en-us/iis/extensions/iis-compression/iis-compression-overview)
- [Install URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
- Enable overriding of `HTTP_ACCEPT_ENCODING` within `allowedServerVariables` in urlrewrite:
  - Open IIS
  - Open _Configuration Editor_ within _Management_
  - Expand the _section_ drop down to find `system.webServer/rewrite/allowedServerVariables`
  - Click _Unlock section_ in the _Actions_ pane on the right

## HTTP compression

If you're new to HTTP compression (especially with IIS) then read ['IIS Compression Overview' on the Microsoft Docs](https://docs.microsoft.com/en-us/iis/extensions/iis-compression/iis-compression-overview).

We use dynamic compression to improve performance. It's _dynamic_ compression rather than _static_ because the gatsby static files aren't served straight from the file system via IIS. They're routed via the .NET Core runtime and served via the `UseStaticFiles` middleware.

There are 2 compression algorithms: [Brotli](https://github.com/google/brotli) and [gzip](https://www.gzip.org/), and we favour Brotli. Brotli is a newer algorithm by Google and is, in theory, [15-20% more efficient](https://en.wikipedia.org/wiki/Brotli#Gzip_vs_Brotli) than gzipping. Brotli is also supposed to be particularly effective for text documents, and in our case we're mostly serving text (HTML, JS and JSON) so we should see good results. [Global browser support for Brotli](https://caniuse.com/#feat=brotli) is up around 94% as of May 2020.

The compression comes from the _IIS Dynamic Compression_ module via hosting the web app in IIS, rather than using the [compression middleware built in to .NET Core](https://docs.microsoft.com/en-us/aspnet/core/performance/response-compression?view=aspnetcore-3.1). This is because of performance and is recommended in the docs. This is why there are extra steps to configure IIS for hosting, see the [Deploying to IIS](#deploying-to-iis) section above. This also means you won't get HTTP compression when running the app locally in Kestrel or IIS Express.

There's a [bug in IIS < 1803](https://docs.microsoft.com/en-us/iis/extensions/iis-compression/using-iis-compression#before-iis-100-version-1803) that means gzip is always preferred even if a requests's `Accept-Encoding` header contaings _br_ e.g. `Accept-Encoding: gzip, deflate, br`. This is why there's a URL Rewrite rule called _Prioritize Brotli_ that rewrites the `Accept-Encoding` header. See the [web.config](CKS.Web/web.config) for the implementation details.

> Note: brotli only works over HTTPS so if you're only seeing GZIP encoded responses, make sure you're serving over HTTPS.

## Tests

We use [xUnit](https://xunit.net/) as a test runner with [Moq](https://github.com/moq/moq4) for mocking and [Shouldly](https://github.com/shouldly/shouldly) for assertions.

We have two of levels of tests within the web-app project:

- low-level [unit tests](https://docs.microsoft.com/en-us/dotnet/core/testing/?pivots=xunit)
- [integration tests](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-3.1).

The integration tests use a test web host and an in-memory test server to ensure the app works as a whole, including file system and network access.

> Note: there are also [Jest tests for the Gatsby static site](../gatsby#readme) and [high-level functional, browser-based tests](../functional-tests#readme).

Try to follow [Microsoft's conventions for naming tests](https://github.com/dotnet/aspnetcore/wiki/Engineering-guidelines#unit-tests-and-functional-tests) and the surrounding code style wherever possible.

### Running the tests

Run the test from either:

- VSCode
- _Test Explorer_ window in Visual Studio
- _Resharper_ in Visual Studio
- command line.

#### From VSCode

VSCode has built in support for running and debugging individual .NET tests.

Open a test file e.g. _SearchTest.cs_ and click _Run Test_ or _Debug Test_ above the method signature.

#### From command line

Open a terminal at the web-app folder (right click on the web-app folder in the VSCode explorer and choose 'Open in Terminal') and run the following command to run all the tests:

```sh
# From the web-app folder
dotnet test
```

Or run a single test file by matching its name with the `--filter` argument. For example to run test files containing _search_ e.g. SearchTests, use `--filter search`:

```sh
# From the web-app folder
dotnet test --filter search
```

See the [dotnet test command docs](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-test) for all the CLI options.
