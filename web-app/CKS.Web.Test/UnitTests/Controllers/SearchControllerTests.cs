using System;
using System.Collections.Generic;
using System.Text;
using Shouldly;
using Xunit;
using CKS.Web.Controllers;
using Moq;
using Microsoft.Extensions.Logging;
using NICE.Search.Common.Urls;

namespace CKS.Web.Test.UnitTests.Controllers
{
	public class SearchControllerTests
	{
		[Obsolete("Please replace this test with a real test when the search endpoint is setup")]
		[Fact]
		public void ASampleTestReturnsNonNullObject()
		{
			//var searchController = new SearchController(Mock.Of<ILogger<SearchController>>());

			//searchController.Get(new SearchUrl()).ShouldNotBeNull();
		}
	}
}
