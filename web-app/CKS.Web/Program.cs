using System;
using CKS.Web.Hosting;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;

namespace CKS.Web
{
	public class Program
	{
		public static void Main(string[] args)
		{
			Log.Logger = SeriLogger.GetLoggerConfiguration().CreateLogger();
			try
			{
				CreateHostBuilder(args).Build().Run();
			}
			catch (Exception ex)
			{
				Log.Fatal(ex, "Application start-up failed");
			}
			finally
			{
				Log.CloseAndFlush();
			}
		}

		public static IHostBuilder CreateHostBuilder(string[] args) =>
			Host.CreateDefaultBuilder(args)
				.UseSerilog()
				.ConfigureWebHostDefaults(webBuilder =>
					{
						webBuilder
							.ConfigureKestrel(o => o.AddServerHeader = false)
							.UseStartup<Startup>();
					})
				.ConfigureServices(services =>
					{
						services.AddTransient<IStartupFilter, SecurityHeadersStartupFilter>();
					});
	}
}
