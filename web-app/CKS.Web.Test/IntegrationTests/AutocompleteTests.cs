using CKS.Web.Test.IntegrationTests.Infrastructure;
using Moq;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class AutocompleteTests : TestBase
	{
		public AutocompleteTests(ITestOutputHelper output) : base(output)
		{ }

		private static readonly List<TypeAhead> TypeAheadResults = new List<TypeAhead> {
						new TypeAhead { Title = "Diabetes - type 1", TypeAheadType = "title", TypeAheadLink = "/topics/diabetes-type-1/" },
						new TypeAhead { Title = "diabetes", TypeAheadType = "keyword", TypeAheadLink = "/search/?q=diabetes" }
					};

		[Fact]
		public async void AutoCompleteReturnsJson()
		{
			// Arrange
			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider
				.Setup(x => x.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults {
					Failed = false,
					Results = TypeAheadResults
				});

			var client = _factory
				.WithImplementation(mockSearchProvider.Object)
				.CreateClient();

			// Act
			var response = await client.GetAsync("/api/autocomplete?q=diab");
			var responseBody = await response.Content.ReadAsStringAsync();

			// Assert
			response.StatusCode.ShouldBe(HttpStatusCode.OK);
			responseBody.ShouldMatchApproved();
		}

		[Fact]
		public async void OpenSearchReturnsJson()
		{
			// Arrange
			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider
				.Setup(x => x.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults
				{
					Failed = false,
					Results = TypeAheadResults
				});

			var client = _factory
				.WithImplementation(mockSearchProvider.Object)
				.CreateClient();

			// Act
			var response = await client.GetAsync("/api/autocomplete/opensearch?q=diab");
			var responseBody = await response.Content.ReadAsStringAsync();

			// Assert
			response.StatusCode.ShouldBe(HttpStatusCode.OK);
			responseBody.ShouldMatchApproved();
		}
	}
}
