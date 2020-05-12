using CKS.Web.Test.IntegrationTests.Infrastructure;
using CKS.Web.Test.IntegrationTests.TestResponseExtensions;
using Moq;
using Newtonsoft.Json;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using Shouldly;
using System.IO;
using System.Net;
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
			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider.Setup(x => x.Search(It.IsAny<ISearchUrl>())).Returns(new SearchResults { });
			var client = _factory
				.WithImplementation<ISearchProvider>(mockSearchProvider.Object)
			    .CreateClient();

			// Act
			var response = await client.GetAsync("/api/search");

			// Assert
			response.StatusCode.ShouldBe(System.Net.HttpStatusCode.OK);
			response.Content.Headers.ContentType.MediaType.ShouldBe("application/json");
		}


		[Fact]
		public async void SearchForCancerReturnsCorrectJson()
		{
			// Arrange
			var realSearchResults =  JsonConvert.DeserializeObject<SearchResults>(File.ReadAllText(@"./IntegrationTests/Fakes/FakeSearchResult-Cancer.json"));
			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider.Setup(x => x.Search(It.IsAny<ISearchUrl>())).Returns(realSearchResults);

			var client = _factory
				.WithImplementation<ISearchProvider>(mockSearchProvider.Object)
				.CreateClient();

			//Act
			var response = await client.GetAsync("/api/search?q=cancer");
			var responseBody = await response.Content.ReadAsStringAsync();
			responseBody = Formatter.FormatJson(responseBody);

			//Assert
			response.StatusCodeIs(HttpStatusCode.OK);
			responseBody.ShouldMatchApproved();
		}

		[Fact]
		public async void FailSearchRespondsCorrectly()
		{
			// Arrange
			var realSearchResults = JsonConvert.DeserializeObject<SearchResults>(File.ReadAllText(@"./IntegrationTests/Fakes/FakeFailedSearch.json"));
			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider.Setup(x => x.Search(It.IsAny<ISearchUrl>())).Returns(realSearchResults);

			var client = _factory
				.WithImplementation<ISearchProvider>(mockSearchProvider.Object)
				.CreateClient();

			//Act
			var response = await client.GetAsync("/api/search");
			var responseBody = await response.Content.ReadAsStringAsync();
			responseBody = Formatter.FormatJson(responseBody);

			//Assert
			response.StatusCodeIs(HttpStatusCode.InternalServerError);
			responseBody.ShouldMatchApproved();
		}
	}
}
