using CKS.Web.Test.IntegrationTests.Infrastructure.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using Xunit.Abstractions;

namespace CKS.Web.Test.IntegrationTests.Infrastructure
{
	public class CKSWebApplicationFactory : WebApplicationFactory<Startup>
	{
		private readonly ITestOutputHelper _output;
		private readonly IList<Action<IServiceCollection>> serviceCollectionsActions = new List<Action<IServiceCollection>>();
		private string webRootPath = null;

		public CKSWebApplicationFactory(ITestOutputHelper output)
		{
			_output = output;
			_output.WriteLine("CKSWebApplicationFactory.constructor");

			this.ClientOptions.BaseAddress = new Uri("https://cks-integration-tests.nice.org.uk");
		}

		protected override void ConfigureWebHost(IWebHostBuilder builder)
		{
			_output.WriteLine("CKSWebApplicationFactory.ConfigureWebHost");

			builder.UseEnvironment("Testing");

			var projectDir = Directory.GetCurrentDirectory();
			var configPath = Path.Combine(projectDir, "appsettings.test.json");

			builder.ConfigureAppConfiguration((context, conf) =>
			{
				conf.AddJsonFile(configPath);
			});

			builder.ConfigureTestServices(services =>
			{
				foreach (Action<IServiceCollection> action in serviceCollectionsActions)
				{
					action.Invoke(services);
				}

				var serviceProvider = services.BuildServiceProvider();
			});

			if(webRootPath != null)
				builder.UseWebRoot(webRootPath);
		}

		public CKSWebApplicationFactory WithImplementation<TService>(TService implementation)
		{
			serviceCollectionsActions.Add(services => services.ReplaceService(implementation));
			return this;
		}

		public CKSWebApplicationFactory UseWebRoot(string path)
		{
			webRootPath = Path.Join(Directory.GetCurrentDirectory(), path);
			return this;
		}

		public CKSWebApplicationFactory WithFakeSearchProvider(string fakeSearchResultsFileName = null)
		{
			var searchResults = new SearchResults();
			if(fakeSearchResultsFileName != null)
				searchResults = JsonConvert.DeserializeObject<SearchResults>(File.ReadAllText(@"./IntegrationTests/Fakes/" + fakeSearchResultsFileName));

			var mockSearchProvider = new Mock<ISearchProvider>();
			mockSearchProvider.Setup(x => x.Search(It.IsAny<ISearchUrl>())).Returns(searchResults);
			var client = this
				.WithImplementation<ISearchProvider>(mockSearchProvider.Object)
				.CreateClient();

			return this;
		}
	}
}
