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
				//Files in /static and files with gatsby generated file names should be
				//cached forever as documented in https://www.gatsbyjs.org/docs/caching/
				//Files with persistant names across builds shouldnt be cached forever eg.json, html, xml
				OnPrepareResponse = ctx =>
				{					
					var fileName = ctx.File.Name;
					var headers = ctx.Context.Response.Headers;

					if (fileName.EndsWith(".css") ||
						ctx.Context.Request.Path.Value.Contains("/static/") ||
						(fileName.EndsWith(".js") && fileName != "sw.js"))
					{
						headers[HeaderNames.CacheControl] = "public,immutable,max-age=31536000";
					}
					else
						headers[HeaderNames.CacheControl] = "public,must-revalidate,max-age=0";
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
