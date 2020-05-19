using CKS.Web.Test.IntegrationTests.Infrastructure;
using Shouldly;
using System.Net;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class NotFoundTests : TestBase
	{
		public NotFoundTests(ITestOutputHelper output)
			: base(output)
		{
		}

		[Fact]
		public async void ReturnsCustom404PageForUnmatchedRoute()
		{
			using var client = _factory.CreateClient();
			var response = await client.GetAsync("/random-route");

			response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
		}
	}
}
