using CKS.Web.Test.IntegrationTests.Infrastructure;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class ResponseHeaderTests : TestBase
	{
		public ResponseHeaderTests(ITestOutputHelper output) : base(output) {}

		[Fact]
		public async void ByDefaultCorrectCacheControlHeadersAreReturned()
		{
			// Arrange
			var client = _factory
				.SetStaticContentPath("\\IntegrationTests\\Fakes\\")
				.CreateClient();

			//Act
			var responseForJson = await client.GetAsync("test.json");
			var responseForHtml = await client.GetAsync("test.html");
			var defaultRespone = await client.GetAsync("test.xml");

			// Assert
			responseForJson.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
			responseForHtml.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
			defaultRespone.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
		}

		[Fact]
		public async void ItemsInTheStaticDirReturnCorrectCacheControlHeaders()
		{
			// Arrange
			var client = _factory
				.SetStaticContentPath("\\IntegrationTests\\Fakes\\")
				.CreateClient();

			//Act
			var response = await client.GetAsync("static/test.png");

			// Assert
			response.Headers.CacheControl.ToString().ShouldBe("public, max-age=86400, immutable");
		}

		[Fact]
		public async void JsAndCssReturnCorrectCacheControlHeaders()
		{
			// Arrange
			var client = _factory
				.SetStaticContentPath("\\IntegrationTests\\Fakes\\")
				.CreateClient();

			//Act
			var responseForJs = await client.GetAsync("test.js");
			var responseForCss = await client.GetAsync("test.css");

			// Assert
			responseForJs.Headers.CacheControl.ToString().ShouldBe("public, max-age=86400, immutable");
			responseForCss.Headers.CacheControl.ToString().ShouldBe("public, max-age=86400, immutable");
		}

		[Fact]
		public async void SpecialFilesReturnCorrectCacheControlHeaders()
		{
			// Arrange
			var client = _factory
				.SetStaticContentPath("\\IntegrationTests\\Fakes\\")
				.CreateClient();

			//Act
			var response = await client.GetAsync("sw.js");

			// Assert
			response.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
		}
	}
}
