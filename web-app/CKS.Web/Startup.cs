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
			if (Enum.TryParse<ApplicationEnvironment>(environmentString, out environmentAsEnum))
			{
				services.AddSingleton<ISearchProvider, SearchProvider>(ISearchProvider => new SearchProvider(environmentAsEnum));
			}
			else
			{
				throw new Exception("ElasticSearchEnvironment app setting could not be parsed");
			}

			services.AddControllers();

			services.AddResponseCaching(options =>
				{
					// Increase the size limit (default is 100MB)
					options.SizeLimit = 500 * 1024 * 1024;
				});
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UseResponseCaching();

			app.UseStatusCodePagesWithReExecute("/{0}.html");

			app.UseDefaultFiles();
			app.UseStaticFiles(new GatsbyStaticFileOptions { });

			ConfigureRouting(app);

			// Do redirects last so we don't have to evaluate them for requests to static files.
			// UseStaticFiles is a terminating middleware, so requests won't carry on executing
			ConfigureRedirects(app, env);
		}

		public void ConfigureDevelopment(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UseDeveloperExceptionPage();

			app.UseResponseCaching();

			var gatsbyPublicDir = Path.Combine(Directory.GetCurrentDirectory(), "../../gatsby/public");

			app.UseStatusCodePagesWithReExecute("/{0}.html");

			// Serve static files straight for Gatsby's public folder when running locally.
			// This means you don't have to copy the Gatsby output into the wwwroot folder like we do on TeamCity.
			var localGatsbyFileProvider = new PhysicalFileProvider(gatsbyPublicDir);
			app.UseDefaultFiles(new DefaultFilesOptions
			{
				FileProvider = localGatsbyFileProvider
			});
			app.UseStaticFiles(new GatsbyStaticFileOptions()
			{
				FileProvider = localGatsbyFileProvider
			});

			ConfigureRouting(app);

			ConfigureRedirects(app, env, gatsbyPublicDir);
		}

		private void ConfigureRouting(IApplicationBuilder app)
		{
			app.UseRouting();
			app.UseEndpoints(endpoints =>
			{
				endpoints.MapControllers();
			});
		}

		private void ConfigureRedirects(IApplicationBuilder app, IWebHostEnvironment env, string webRootPath = null)
		{
			string htaccessPath = webRootPath ?? env.WebRootPath;
			using (StreamReader gatsbyModRewriteStreamReader = File.OpenText(Path.Join(htaccessPath, ".htaccess")))
				app.UseRewriter(
					new RewriteOptions()
						.AddApacheModRewrite(gatsbyModRewriteStreamReader)
					);
		}
	}
}
