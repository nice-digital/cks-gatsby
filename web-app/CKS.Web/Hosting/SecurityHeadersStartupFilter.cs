using System;
using CKS.Web.Middleware;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

namespace CKS.Web.Hosting
{
	/// <summary>
	/// Custom startup filter to register the security headers middlware, so that it gets called before all requests.
	/// </summary>
	public class SecurityHeadersStartupFilter : IStartupFilter
	{
		public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
		{
			return builder =>
			{
				builder.UseMiddleware<SecurityHeadersMiddleware>();
				next(builder);
			};
		}
	}
}
