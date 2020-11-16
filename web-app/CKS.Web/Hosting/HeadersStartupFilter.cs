using System;
using CKS.Web.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace CKS.Web.Hosting
{
	/// <summary>
	/// Custom startup filter to register headers middlware, so that it gets called before all requests.
	/// </summary>
	public class HeadersStartupFilter : IStartupFilter
	{
		public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
		{
			return builder =>
			{
				builder.UseMiddleware<HeadersMiddleware>();
				next(builder);
			};
		}
	}
}
