using CKS.Web.Test.IntegrationTests.Infrastructure;
using Shouldly;
using System;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class SearchTests : TestBase
	{
		public SearchTests(ITestOutputHelper output) : base(output)
		{ }

		[Obsolete("Please replace this test with a real test when the search endpoint is setup")]
		[Fact]
		public async void ReturnsJson()
		{
			// Arrange
			var client = _factory
			   .CreateClient();

			// Act
			var response = await client.GetAsync("/api/search");

			response.StatusCode.ShouldBe(System.Net.HttpStatusCode.OK);
			response.Content.Headers.ContentType.MediaType.ShouldBe("application/json");
		}
	}
}
