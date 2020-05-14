using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests.Infrastructure
{
	public abstract class TestBase : IDisposable
	{
		protected readonly CKSWebApplicationFactory _factory;
		protected readonly ITestOutputHelper _output;

		public TestBase(ITestOutputHelper output)
		{
			_factory = new CKSWebApplicationFactory(output);
			_output = output;

			ShouldlyConfiguration.ShouldMatchApprovedDefaults
				.WithScrubber(s =>
				{
					try
					{
						return JObject.Parse(s).ToString(Formatting.Indented);
					}
					catch { }
					return s;
				});
		}

		public virtual void Dispose()
		{
			_factory.Dispose();
		}
	}
}
