using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NICE.Search.Common.Interfaces;
using NICE.Search.Providers;
using NICE.Search.Common.Enums;
using Microsoft.Net.Http.Headers;
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

			var environmentString = Configuration.GetValue<string>("ElasticSearchEnvironment");
			ApplicationEnvironment environmentAsEnum;
			Enum.TryParse<ApplicationEnvironment>(environmentString, out environmentAsEnum);
			if(environmentAsEnum != null)
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

			app.UseDefaultFiles();
			app.UseStaticFiles(new StaticFileOptions
			{
				OnPrepareResponse = ctx =>
				{					
					var fileName = ctx.File.Name;
					var fileExtension = Path.GetExtension(fileName).ToLower();
					var durationInSeconds = 0;
					var cacheHeaderValues = new List<string> { "public" };

					if (fileExtension == ".css"
					|| ctx.Context.Request.Path.Value.Contains("/static/")
					|| (fileExtension == ".js" && fileName != "sw.js"))
					{
						cacheHeaderValues.Add("immutable");
						durationInSeconds = 60 * 60 * 24 * 365;
					}
					else 
						cacheHeaderValues.Add("must-revalidate");

					cacheHeaderValues.Add("max-age=" + durationInSeconds);

					ctx.Context.Response.Headers[HeaderNames.CacheControl] =
						String.Join(',', cacheHeaderValues);
				}
			});

			app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
		}
    }
}
