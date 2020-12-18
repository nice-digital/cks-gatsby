using Shouldly;
using Xunit;
using CKS.Web.Controllers;
using Moq;
using Microsoft.Extensions.Logging;
using NICE.Search.Common.Urls;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using System;
using CKS.Web.Test.IntegrationTests.Infrastructure.Extensions;

namespace CKS.Web.Test.UnitTests.Controllers
{
	public class SearchControllerTests
	{
		[Fact]
		public void ASearchCanBePerformed()
		{
			var searchProvider = new Mock<ISearchProvider>();
			searchProvider.Setup(sp => sp.Search(It.IsAny<ISearchUrl>())).Returns(new SearchResults());
			var searchController = new SearchController(Mock.Of<ILogger<SearchController>>(), searchProvider.Object);

			var result = searchController.Get(new SearchUrl());

			result.Value.ShouldNotBeNull();
			result.StatusCode.ShouldBe(200);
		}


		[Fact]
		public void AFailedSearchWillReturn500()
		{
			var searchProvider = new Mock<ISearchProvider>();
			searchProvider.Setup(sp => sp.Search(It.IsAny<ISearchUrl>())).Returns(new SearchResults() { Failed = true });
			var searchController = new SearchController(Mock.Of<ILogger<SearchController>>(), searchProvider.Object);

			var response = searchController.Get(new SearchUrl());
			var responseData = response.Value as SearchResults;

			response.StatusCode.ShouldBe(500);
			responseData.Failed.ShouldBeTrue();

		}

		[Fact]
		public void AFailedSearchWillLogError()
		{
			var searchProvider = new Mock<ISearchProvider>();
			searchProvider.Setup(sp => sp.Search(It.IsAny<ISearchUrl>())).Returns(
				new SearchResults()
				{
					Failed = true,
					ErrorMessage = "Some error message"
				});

			var mockLogger = new Mock<ILogger<SearchController>>();
			var searchController = new SearchController(mockLogger.Object, searchProvider.Object);

			var response = searchController.Get(new SearchUrl() { q = "cancer" });

			mockLogger.VerifyLog(logger => logger.LogError("Search exception - Some error message. Search url - search?ps=15&q=cancer."));
		}

		[Fact]
		public void ShouldSetDefaultPageSize()
		{
			var searchProvider = new Mock<ISearchProvider>();
			searchProvider.Setup(sp => sp.Search(It.IsAny<ISearchUrl>())).Returns(new SearchResults() { });

			var searchController = new SearchController(Mock.Of<ILogger<SearchController>>(), searchProvider.Object);

			var searchUrl = new SearchUrl();
			searchController.Get(searchUrl);

			searchUrl.ps.ShouldBe(SearchController.DEFAULT_PAGE_SIZE);
		}
	}
}
