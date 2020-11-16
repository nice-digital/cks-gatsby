using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CKS.Web.Middleware
{
	public class HeadersMiddleware
	{
		private readonly RequestDelegate _next;

		public HeadersMiddleware(RequestDelegate next)
		{
			_next = next;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			context.Response.Headers.Add("Link", "<https://apikeys.civiccomputing.com>; rel='preconnect'; crossorigin, <https://www.googletagmanager.com>; rel='preconnect'; crossorigin, <https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel='preload'; crossorigin");

			await _next(context);
		}
	}
}
