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
			using(var client = _factory
				.UseWebRoot("/IntegrationTests/Fakes")
				.CreateClient())
			{				
				var response = await client.GetAsync(filename);
								
				response.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
			}			
		}

		[Fact]
		public async void StaticDirectoryReturnsForeverCacheHeader()
		{
			
			using (var client = _factory
				.UseWebRoot("/IntegrationTests/Fakes")
				.CreateClient())
			{				
				var response = await client.GetAsync("static/test.png");
				
				response.Headers.CacheControl.ToString().ShouldBe("public, max-age=31536000, immutable");
			}
		}

		[Fact]
		public async void JsAndCssReturnForeverCacheControlHeaders()
		{
			
			using (var client = _factory
				.UseWebRoot("/IntegrationTests/Fakes")
				.CreateClient())
			{				
				var responseForJs = await client.GetAsync("test.js");
				var responseForCss = await client.GetAsync("test.css");
								
				responseForJs.Headers.CacheControl.ToString().ShouldBe("public, max-age=31536000, immutable");
				responseForCss.Headers.CacheControl.ToString().ShouldBe("public, max-age=31536000, immutable");
			}
		}

		[Fact]
		public async void ServiceWorkerReturnsRevalidateCacheHeader()
		{
			
			using (var client = _factory
				.UseWebRoot("/IntegrationTests/Fakes")
				.CreateClient())
			{				
				var response = await client.GetAsync("sw.js");
								
				response.Headers.CacheControl.ToString().ShouldBe("public, must-revalidate, max-age=0");
			}
		}
	}
}
