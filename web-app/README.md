# Search web application for KCS

> .NET Core 3 web application for NICE Clinical Knowledge Summaries (CKS) to host the static site generated via Gatsby and to serve a search API endpoint

<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->
- [Search web application for KCS](#search-web-application-for-kcs)
	- [Stack](#stack)
		- [Software](#software)
		- [Tests](#tests)
<!-- END doctoc -->
</details>

## Stack

### Software

- [Visual Studio 2019](https://visualstudio.microsoft.com/vs/)
- [.NET Core 3](https://dotnet.microsoft.com/)
- [xUnit](https://xunit.net/) for tests
  - With [Moq](https://github.com/moq/moq4) for mocking
  - And [Shouldly](https://github.com/shouldly/shouldly) for assertions

### Tests

We use [xUnit](https://xunit.net/) as a test runner with [Moq](https://github.com/moq/moq4) for mocking and [Shouldly](https://github.com/shouldly/shouldly) for assertions.

We have two of levels of tests within the web-app project:

- low-level [unit tests](https://docs.microsoft.com/en-us/dotnet/core/testing/)
- [integration tests](https://docs.microsoft.com/en-us/aspnet/core/test/integration-tests?view=aspnetcore-3.1).

> Note: there are also [Jest tests for the Gatsby static site](../gatsby#readme) and [high-level functional, browser-based tests](../functional-tests#readme).

Try to follow [Microsoft's conventions for naming tests](https://github.com/dotnet/aspnetcore/wiki/Engineering-guidelines#unit-tests-and-functional-tests) and the surrounding code style wherever possible.

Run the tests via the _Test Explorer_ window in Visual Studio, or on the command line:

```sh
# From the repository root
dotnet test web-app/CKS.Web.Test/CKS.Web.Test.csproj
```
