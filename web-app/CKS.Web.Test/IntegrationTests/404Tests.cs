using CKS.Web.Test.IntegrationTests.Infrastructure;
using Shouldly;
using System;
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
		public async void Returns404Page()
		{
			// Arrange
			var client = _factory.CreateClient();

			// Act
			var response = await client.GetAsync("/404");

			response.StatusCode.ShouldBe(System.Net.HttpStatusCode.OK);
		}
	}
}
