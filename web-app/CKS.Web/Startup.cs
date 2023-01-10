using CKS.Web.StaticFiles;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using NICE.Search.Common.Interfaces;
using NICE.Search.HttpClient;
using System.IO;

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

			/*TODO:Uncomment this to rollback to legacy NICE.Search Client
			var environmentString = Configuration.GetValue<string>("ElasticSearchEnvironment");
			ApplicationEnvironment environmentAsEnum;
			if (Enum.TryParse<ApplicationEnvironment>(environmentString, out environmentAsEnum))
			{
				services.AddSingleton<ISearchProvider, SearchApiProvider>(ISearchProvider => new SearchApiProvider(environmentAsEnum));
			}
			else
			{
				throw new Exception("ElasticSearchEnvironment app setting could not be parsed");
			}
			 */
			var environmentString = Configuration.GetValue<string>("SearchApiUrl");
			var indexToQuery = "cks";
			var httpClientWrapper = new HttpClientWrapper();
			services.AddSingleton<ISearchProvider, SearchHttpClient>(ISearchProvider => new SearchHttpClient(environmentString, indexToQuery, httpClientWrapper));

			services.AddControllers();
		}

		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
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
