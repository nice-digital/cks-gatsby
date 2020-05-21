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

		[Theory]
		[InlineData("test.json")]
		[InlineData("test.html")]
		[InlineData("test.xml")]
		public async void ReturnsMustRevalidateNoCacheHeader(string filename)
		{
			// Arrange
			using(var client = _factory
				.UseWebRoot("\\IntegrationTests\\Fakes\\")
				.CreateClient())
			{
				//Act
				var respone = await client.GetAsync(filename);

				// Assert
				respone.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
			}			
		}

		[Fact]
		public async void StaticDirectoryReturnsForeverCacheHeader()
		{
			// Arrange
			using (var client = _factory
				.UseWebRoot("\\IntegrationTests\\Fakes\\")
				.CreateClient())
			{
				//Act
				var response = await client.GetAsync("static/test.png");

				// Assert
				response.Headers.CacheControl.ToString().ShouldBe("public, max-age=31536000, immutable");
			}
		}

		[Fact]
		public async void JsAndCssReturnForeverCacheControlHeaders()
		{
			// Arrange
			using (var client = _factory
				.UseWebRoot("\\IntegrationTests\\Fakes\\")
				.CreateClient())
			{
				//Act
				var responseForJs = await client.GetAsync("test.js");
				var responseForCss = await client.GetAsync("test.css");

				// Assert
				responseForJs.Headers.CacheControl.ToString().ShouldBe("public, max-age=31536000, immutable");
				responseForCss.Headers.CacheControl.ToString().ShouldBe("public, max-age=31536000, immutable");
			}
		}

		[Fact]
		public async void ServiceWorkerReturnsRevalidateCacheHeader()
		{
			// Arrange
			using (var client = _factory
				.UseWebRoot("\\IntegrationTests\\Fakes\\")
				.CreateClient())
			{
				//Act
				var response = await client.GetAsync("sw.js");

				// Assert
				response.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
			}
		}
	}
}
