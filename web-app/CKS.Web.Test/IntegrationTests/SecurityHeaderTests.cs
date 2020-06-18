using CKS.Web.Test.IntegrationTests.Infrastructure;
using Shouldly;
using System;
using System.Linq;
using System.Collections.Generic;
using Xunit;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests
{
	public class SecurityHeaderTests : TestBase
	{
		public SecurityHeaderTests(ITestOutputHelper output) : base(output)
		{ }

		public static TheoryData<string, string> ExpectedHeaders
		{
			get
			{
				var data = new TheoryData<string, string>();
				data.Add("X-Frame-Options", "SAMEORIGIN");
				data.Add("X-Xss-Protection", "1; mode=block");
				data.Add("X-Content-Type-Options", "nosniff");
				data.Add("Referrer-Policy", "strict-origin-when-cross-origin");
				return data;
			}
		}

		[Theory]
		[MemberData(nameof(ExpectedHeaders))]
		public async void ShouldSetSecurityHeader(string headerName, string headerValue)
		{
			using (var client = _factory.CreateClient())
			{
				(await client.GetAsync("/"))
					.Headers
					.ShouldContain(header =>
						header.Key == headerName &&
						header.Value.Single() == headerValue);
			}
		}
	}
}
