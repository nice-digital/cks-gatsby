using CKS.Web.Test.IntegrationTests.Infrastructure;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
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
				.WithFakeSearchProvider("FakeSearchResultsModel.json")
				.CreateClient();

			// Act
			var response = await client.GetAsync("/api/search");
			var responseBody = await response.Content.ReadAsStringAsync();

			// Assert
			response.StatusCode.ShouldBe(System.Net.HttpStatusCode.OK);
			response.Content.Headers.ContentType.MediaType.ShouldBe("application/json");

			var expected = JObject.Parse(File.ReadAllText(@"./IntegrationTests/Fakes/FakeSearchResultsModel.json"))
							.ToString(Formatting.Indented);
			responseBody = JObject.Parse(responseBody)
							.ToString(Formatting.Indented);

			responseBody.ShouldBe(expected);
		}
	}
}
