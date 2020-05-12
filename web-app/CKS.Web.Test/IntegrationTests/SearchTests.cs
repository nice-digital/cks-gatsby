using CKS.Web.Test.IntegrationTests.Infrastructure;
using CKS.Web.Test.IntegrationTests.TestResponseExtensions;
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


		private HttpClient SetupClientWithFakeSearchProvider(string fakeSearchResultsFilePath = null)
		{
			var searchResults = new SearchResults();
			if(fakeSearchResultsFilePath != null)
				searchResults = JsonConvert.DeserializeObject<SearchResults>(File.ReadAllText(fakeSearchResultsFilePath));

			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider.Setup(x => x.Search(It.IsAny<ISearchUrl>())).Returns(searchResults);
			var client = _factory
				.WithImplementation<ISearchProvider>(mockSearchProvider.Object)
				.CreateClient();

			return client;
		}

		[Fact]
		public async void ReturnsJson()
		{
			// Arrange
			var client = SetupClientWithFakeSearchProvider();

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
			var client = SetupClientWithFakeSearchProvider(@"./IntegrationTests/Fakes/FakeSearchResult-Cancer.json");

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
			var client = SetupClientWithFakeSearchProvider(@"./IntegrationTests/Fakes/FakeFailedSearch.json");
			
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
