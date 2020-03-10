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
		}

		public virtual void Dispose()
		{
			_factory.Dispose();
		}
	}
}
