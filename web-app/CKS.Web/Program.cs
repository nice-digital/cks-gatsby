using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using System;

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
					});
	}
}
