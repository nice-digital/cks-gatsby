using CKS.Web.Test.IntegrationTests.Infrastructure.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
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
		private readonly IList<Action<IServiceCollection>> serviceCollectionsActions = new List<Action<IServiceCollection>>();

		public CKSWebApplicationFactory(ITestOutputHelper output)
		{
			_output = output;
			_output.WriteLine("CKSWebApplicationFactory.constructor");
		}

		protected override void ConfigureWebHost(IWebHostBuilder builder)
		{
			_output.WriteLine("CKSWebApplicationFactory.ConfigureWebHost");

			builder.ConfigureTestServices(services =>
			{
				foreach (Action<IServiceCollection> action in serviceCollectionsActions)
				{
					action.Invoke(services);
				}

				var serviceProvider = services.BuildServiceProvider();
			});

			base.ConfigureWebHost(builder);
		}

		public CKSWebApplicationFactory WithImplementation<TService>(TService implementation)
		{
			serviceCollectionsActions.Add(services => services.ReplaceService(implementation));
			return this;
		}

		#endregion
	}
}
