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
using System.Collections.Generic;
using CKS.Web.Models;
using System.Linq;
using System.Collections;

namespace CKS.Web.Test.UnitTests.Controllers
{
    public class AutocompleteControllerTests
    {
		#region Constructor

		// Use 1 'title' (topic) result and one keyword result to test different scenarios
		private static readonly List<TypeAhead> ResultsList = new List<TypeAhead>() {
			new TypeAhead { Title = "Diabetes - type 1", TypeAheadType = "title", TypeAheadLink = "/topics/diabetes-type-1/" },
			new TypeAhead { Title = "diabetes", TypeAheadType = "keyword", TypeAheadLink = "/search?q=diabetes" },
		};

		private readonly Mock<ILogger<AutocompleteController>> mockLogger;
		private readonly Mock<ISearchProvider> mockSearchProvider;
		private readonly AutocompleteController autocompleteController;

		public AutocompleteControllerTests()
		{
			mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider
				.Setup(sp => sp.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults() { Results = ResultsList });

			mockLogger = new Mock<ILogger<AutocompleteController>>();

			autocompleteController = new AutocompleteController(mockLogger.Object, mockSearchProvider.Object);
		}

		#endregion

		#region Autocomplete endpoint for use with global nav search box

		[Fact]
		public void AutocompleteCallsSearchProviderWithSearchUrl()
		{
			var searchUrl = new SearchUrl() { q = "dia" };
			var result = autocompleteController.Get(searchUrl);

			mockSearchProvider.Verify(mock => mock.TypeAhead(searchUrl), Times.Once());
		}

		[Fact]
		public void AutocompleteReturnsEmptyListWith500ServerErrorWhenSearchFails()
		{
			mockSearchProvider
				.Setup(sp => sp.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults() { Failed = true });

			var response = autocompleteController.Get(new SearchUrl());

			response.StatusCode.ShouldBe(500);
			((IEnumerable<object>) response.Value).Count().ShouldBe(0);
		}

		[Fact]
		public void AutocompleteLogsErrorMessageAndSearchUrlForFailedSearch()
		{
			mockSearchProvider
				.Setup(sp => sp.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults() { Failed = true, ErrorMessage = "An error message" });

			var response = autocompleteController.Get(new SearchUrl() { q = "can" });

			mockLogger.VerifyLog(logger => logger.LogError("Autocomplete exception - An error message. Search url - search?q=can."));
		}

		[Fact]
		public void AutocompleteReturnsResponseWithTypeAheadResultsFromSearch()
		{
			var responseData = (autocompleteController.Get(new SearchUrl()).Value as IEnumerable<AutocompleteItemResponse>).ToList();
			responseData.Count().ShouldBe(2);
		}

		[Fact]
		public void AutocompleteAppendsTopicForTitleResults()
		{
			var responseData = (autocompleteController.Get(new SearchUrl()).Value as IEnumerable<AutocompleteItemResponse>).ToList();
			responseData[0].Title.ShouldBe("Diabetes - type 1 (Topic)");
		}

		[Fact]
		public void AutocompleteUsesTypeAheadLinkForTitleResults()
		{
			var responseData = (autocompleteController.Get(new SearchUrl()).Value as IEnumerable<AutocompleteItemResponse>).ToList();
			responseData[0].Link.ShouldBe("/topics/diabetes-type-1/");
		}

		[Fact]
		public void AutocompleteUsesSERPWithTrailingSlashForKeywordResults()
		{
			var responseData = (autocompleteController.Get(new SearchUrl()).Value as IEnumerable<AutocompleteItemResponse>).ToList();
			responseData[1].Link.ShouldBe("/search/?q=diabetes");
		}

		#endregion

		#region Opensearch suggestions end point

		[Fact]
		public void OpenSearchCallsSearchProviderWithSearchUrl()
		{
			var searchUrl = new SearchUrl() { q = "dia" };
			var result = autocompleteController.GetOpenSearchSuggestions(searchUrl);

			mockSearchProvider.Verify(mock => mock.TypeAhead(searchUrl), Times.Once());
		}

		[Fact]
		public void OpenSearchReturnsEmptyResultListWith500ServerErrorWhenSearchFails()
		{
			mockSearchProvider
				.Setup(sp => sp.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults() { Failed = true });

			var response = autocompleteController.GetOpenSearchSuggestions(new SearchUrl { q = "diab" });

			response.StatusCode.ShouldBe(500);

			var resultList = ((IEnumerable<object>)response.Value).ToList();
			resultList.Count.ShouldBe(4);

			resultList[0].ShouldBe("diab");

			((IEnumerable<string>)resultList[1]).Count().ShouldBe(0);
			((IEnumerable<string>)resultList[2]).Count().ShouldBe(0);
			((IEnumerable<string>)resultList[3]).Count().ShouldBe(0);
		}

		[Fact]
		public void OpenSearchLogsErrorMessageAndSearchUrlForFailedSearch()
		{
			mockSearchProvider
				.Setup(sp => sp.TypeAhead(It.IsAny<ISearchUrl>()))
				.Returns(new TypeAheadResults() { Failed = true, ErrorMessage = "An error message" });

			var response = autocompleteController.GetOpenSearchSuggestions(new SearchUrl() { q = "can" });

			mockLogger.VerifyLog(logger => logger.LogError("Opensearch autocomplete exception - An error message. Search url - search?q=can."));
		}

		[Fact]
		public void OpenSearchReturnsResponseWithTypeAheadResultsFromSearch()
		{
			var response = autocompleteController.GetOpenSearchSuggestions(new SearchUrl { q = "diab" });
			var resultList = ((IEnumerable<object>)response.Value).ToList();

			resultList.Count.ShouldBe(4);
			((IEnumerable<string>)resultList[1]).Count().ShouldBe(2);
		}

		[Fact]
		public void OpenSearchReturnsSearchQueryAsFirstArrayItem()
		{
			var response = autocompleteController.GetOpenSearchSuggestions(new SearchUrl { q = "diab" });
			var resultList = ((IEnumerable<object>)response.Value).ToList();
			((string)resultList[0]).ShouldBe("diab");
		}

		[Fact]
		public void OpenSearchReturnsResultsInSecondArrayItem()
		{
			var response = autocompleteController.GetOpenSearchSuggestions(new SearchUrl { q = "diab" });
			var responseData = ((IEnumerable<object>)response.Value).ToList();

			var resultList = (IEnumerable<string>)responseData[1];

			resultList.ShouldBe(new string[] { "Diabetes - type 1", "diabetes" });
		}

		[Fact]
		public void OpenSearchReturnsLinklsInFourthArrayItem()
		{
			var response = autocompleteController.GetOpenSearchSuggestions(new SearchUrl { q = "diab" });
			var responseData = ((IEnumerable<object>)response.Value).ToList();

			var resultList = (IEnumerable<string>)responseData[3];

			resultList.ShouldBe(new string[] { "/topics/diabetes-type-1/", "/search/?q=diabetes" });
		}

		#endregion
	}
}
