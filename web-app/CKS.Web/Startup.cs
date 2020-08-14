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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;

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

			var esEnv = Configuration.GetValue<string>("ElasticSearchEnvironment");
			ApplicationEnvironment environmentAsEnum;
			if (Enum.TryParse<ApplicationEnvironment>(esEnv, out environmentAsEnum))
			{
				services.AddSingleton<ISearchProvider, SearchProvider>(ISearchProvider => new SearchProvider(environmentAsEnum));
			}
			else
			{
				throw new Exception("ElasticSearchEnvironment app setting could not be parsed");
			}

			services.AddControllers();

			services.Configure<ForwardedHeadersOptions>(options =>
			{
				options.ForwardedHeaders =
					ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
			});

			services.AddHsts(options =>
			{
				//TODO: Investigate why https://hstspreload.org/ times out for nice.org.uk currently
				options.Preload = true;
				options.IncludeSubDomains = true;
				options.MaxAge = TimeSpan.FromDays(60);
			});

		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (!env.IsDevelopment())
			{
				app.UseForwardedHeaders();
				app.UseExceptionHandler("/Error");
				app.UseHsts();
			}

			ConfigureRedirects(app, env);

			app.UseStatusCodePagesWithReExecute("/{0}.html");
			app.UseDefaultFiles();
			app.UseStaticFiles(new GatsbyStaticFileOptions { });

			ConfigureRouting(app);
		}

		public void ConfigureDevelopment(IApplicationBuilder app, IWebHostEnvironment env)
		{
			app.UseDeveloperExceptionPage();

			var gatsbyPublicDir = Path.Combine(Directory.GetCurrentDirectory(), "../../gatsby/public");

			ConfigureRedirects(app, env, gatsbyPublicDir);

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
