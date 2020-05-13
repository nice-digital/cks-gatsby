using CKS.Web.Test.IntegrationTests.Infrastructure;
using Moq;
using Newtonsoft.Json;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using Shouldly;
using System.IO;
using System.Net;
using System.Net.Http;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class SearchTests : TestBase
	{
		public SearchTests(ITestOutputHelper output) : base(output)
		{ }


		[Fact]
		public async void ReturnsJson()
		{
			// Arrange
			var client = _factory
				.WithFakeSearchProvider("FakeSearchResult-Cancer.json")
				.CreateClient();

			// Act
			var response = await client.GetAsync("/api/search");
			var responseBody = await response.Content.ReadAsStringAsync();

			// Assert
			response.StatusCode.ShouldBe(System.Net.HttpStatusCode.OK);
			response.Content.Headers.ContentType.MediaType.ShouldBe("application/json");
			responseBody.ShouldMatchApproved();
		}
	}
}
