using System;
using System.Collections.Generic;
using System.Text;
using Shouldly;
using Xunit;
using CKS.Web.Controllers;
using Moq;
using Microsoft.Extensions.Logging;
using NICE.Search.Common.Urls;
using NICE.Search.Providers;
using NICE.Search.Common.Enums;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using System.Text.Json;

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

			var result = searchController.Get(new SearchUrl() { q = "Cancer" });

			result.Value.ShouldNotBeNull();
			result.StatusCode.ShouldBe(200);
		}


		[Fact]
		public void AFailedSearchWillReturn500()
		{
			var searchProvider = new Mock<ISearchProvider>();
			searchProvider.Setup(sp => sp.Search(It.IsAny<ISearchUrl>())).Returns(new SearchResults() { Failed = true});
			var searchController = new SearchController(Mock.Of<ILogger<SearchController>>(), searchProvider.Object);

			var response = searchController.Get(new SearchUrl());
			var responseData = response.Value as SearchResults;

			response.StatusCode.ShouldBe(500);
			responseData.Failed.ShouldBeTrue();

		}
	}
}
