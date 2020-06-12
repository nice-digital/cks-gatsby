using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using NICE.Search.Common.Interfaces;
using NICE.Search.Providers;
using NICE.Search.Common.Enums;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Rewrite;
using CKS.Web.StaticFiles;
using CKS.Web.Middleware;

namespace CKS.Web
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddRouting(options => options.LowercaseUrls = true);

			var environmentString = Configuration.GetValue<string>("ElasticSearchEnvironment");
			ApplicationEnvironment environmentAsEnum;
			Enum.TryParse<ApplicationEnvironment>(environmentString, out environmentAsEnum);
			if (environmentAsEnum != null)
			{
				services.AddSingleton<ISearchProvider, SearchProvider>(ISearchProvider => new SearchProvider(environmentAsEnum));
			}

			services.AddControllers();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}

			using (StreamReader gatsbyModRewriteStreamReader = File.OpenText(Path.Join(env.WebRootPath, ".htaccess")))
				app.UseRewriter(
					new RewriteOptions()
						.AddApacheModRewrite(gatsbyModRewriteStreamReader)
					);

			app.UseStatusCodePagesWithReExecute("/{0}.html");

			app.UseDefaultFiles();
			app.UseStaticFiles(new GatsbyStaticFileOptions { });

			app.UseRouting();
			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}

		public void ConfigureDevelopment(IApplicationBuilder app, IWebHostEnvironment env)
		{
			// Serve static files straight for Gatsby's public folder when running locally.
			// This means you don't have to copy the Gatsby output into the wwwroot folder like we do on TeamCity.
			var localGatsbyFileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "../../gatsby/public"));
			app.UseDefaultFiles(new DefaultFilesOptions
			{
				FileProvider = localGatsbyFileProvider
			});
			app.UseStaticFiles(new GatsbyStaticFileOptions()
			{
				FileProvider = localGatsbyFileProvider
			});

			Configure(app, env);
		}
	}
}
