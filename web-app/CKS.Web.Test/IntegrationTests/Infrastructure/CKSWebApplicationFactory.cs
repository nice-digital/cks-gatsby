using CKS.Web.Test.IntegrationTests.Infrastructure.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting.Internal;
using Moq;
using Newtonsoft.Json;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
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
			webRootPath = Directory.GetCurrentDirectory() + path;
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
