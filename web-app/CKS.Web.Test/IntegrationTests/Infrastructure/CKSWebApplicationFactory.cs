using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests.Infrastructure
{
	public class CKSWebApplicationFactory : WebApplicationFactory<Startup>
	{
		#region Constructor

		private readonly ITestOutputHelper _output;

		public CKSWebApplicationFactory(ITestOutputHelper output)
		{
			_output = output;
			_output.WriteLine("CKSWebApplicationFactory.constructor");
		}

		#endregion
	}
}
