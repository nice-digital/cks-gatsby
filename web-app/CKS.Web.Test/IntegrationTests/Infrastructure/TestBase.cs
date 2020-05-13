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
					#region Format Json
					bool isJson = false;
					try
					{
						var token = JObject.Parse(s);
						isJson = true;
					}
					catch (Exception e) { }
					

					if (isJson)
					{
						dynamic parsedJson = JsonConvert.DeserializeObject(s);
						s = JsonConvert.SerializeObject(parsedJson, Formatting.Indented);
					}
					#endregion

					return s;
				});
		}

		public virtual void Dispose()
		{
			_factory.Dispose();
		}
	}
}
