using CKS.Web.Test.IntegrationTests.Infrastructure;
using Shouldly;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class CookieSyncTests : TestBase
	{
		public CookieSyncTests(ITestOutputHelper output) : base(output)
		{ }

		[Fact]
		public async void DoesntSetCookieHeaderWhenNoCookies()
		{
			// Arrange
			var client = _factory
				.CreateClient();

			// Act
			var response = await client.GetAsync("/api/cookiesync");

			// Assert
			response.Headers.ShouldNotContain(h => h.Key == "Set-Cookie");
		}

		[Fact]
		public async void SetGACookieWithValueFromRequestAndTwoYearExpiry()
		{
			// Arrange
			var client = _factory
				.CreateClient();

			var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/cookiesync");
			httpRequestMessage.Headers.Add("Cookie", "_ga=foo;");

			// Act
			var response = await client.SendAsync(httpRequestMessage);

			// Assert
			var expectedSetCookieHeaderValues = new string[] {
					"_ga=foo; max-age=63072000; domain=nice.org.uk; path=/"
				};
			response.Headers.GetValues("Set-Cookie").ShouldBe(expectedSetCookieHeaderValues);
		}

		[Fact]
		public async void SetOptimizeCookieWithValueFromRequestAnd90DayExpiry()
		{
			// Arrange
			var client = _factory
				.CreateClient();

			var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/cookiesync");
			httpRequestMessage.Headers.Add("Cookie", "_gaexp=bar;");

			// Act
			var response = await client.SendAsync(httpRequestMessage);

			// Assert
			var expectedSetCookieHeaderValues = new string[] {
					"_gaexp=bar; max-age=7776000; domain=nice.org.uk; path=/"
				};
			response.Headers.GetValues("Set-Cookie").ShouldBe(expectedSetCookieHeaderValues);
		}

		[Fact]
		public async void SetsGAAndOptimizeCookies()
		{
			// Arrange
			var client = _factory
				.CreateClient();

			var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, "/api/cookiesync");
			httpRequestMessage.Headers.Add("Cookie", "_ga=foo; _gaexp=bar");

			// Act
			var response = await client.SendAsync(httpRequestMessage);

			// Assert
			var expectedSetCookieHeaderValues = new string[] {
					"_ga=foo; max-age=63072000; domain=nice.org.uk; path=/",
					"_gaexp=bar; max-age=7776000; domain=nice.org.uk; path=/"
				};
			response.Headers.GetValues("Set-Cookie").ShouldBe(expectedSetCookieHeaderValues);
		}


		[Fact]
		public async void ReturnsTrueJsonResponse()
		{
			// Arrange
			var client = _factory
				.CreateClient();

			// Act
			var response = await client.GetAsync("/api/cookiesync");

			// Assert
			response.StatusCode.ShouldBe(System.Net.HttpStatusCode.OK);
			response.Content.Headers.ContentType.MediaType.ShouldBe("application/json");

			var responseBody = await response.Content.ReadAsStringAsync();
			responseBody.ShouldBe("true");
		}
	}
}
