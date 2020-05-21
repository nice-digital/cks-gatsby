using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace CKS.Web.Middleware
{
	/// <summary>
	/// Sets default 'best-practice' security headers.
	/// </summary>
	/// <remarks>
	/// These *could* be set in the httpProtocol.customHeaders web.config section,
	/// however, these are the concern of the web application, and not the hosting/server.
	/// Unlike 'X-Powered-By' or 'Server', which come from IIS, so these *are* set in web.config.
	/// <remarks>
	/// <remarks>
	/// The Strict-Transport-Security header isn't set here. It's set using UseHsts inside Startup.
	/// </remarks>
	public class SecurityHeadersMiddleware
	{
		private readonly RequestDelegate _next;

		public SecurityHeadersMiddleware(RequestDelegate next)
		{
			_next = next;
		}

		public async Task InvokeAsync(HttpContext context)
		{
			context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
			context.Response.Headers.Add("X-Xss-Protection", "1; mode=block");
			context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
			context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");

			// Ideally we'd use a restrictive policy by default, then allow what we need.
			// E.g. default-src 'none' and add an allowlist of specific directives.
			// BUT because of this bug:
			// https://bugs.chromium.org/p/chromium/issues/detail?id=801561
			// we have to default to 'self' instead and then blocklist other directives.
			// ALSO, VWO and HotJar both require a custom CSP with unsafe inline/eval, see:
			// https://help.vwo.com/hc/en-us/articles/360033753494-VWO-Session-Recording-FAQ-s
			// https://help.hotjar.com/hc/en-us/articles/115011640307-Content-Security-Policies
			context.Response.Headers.Add("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' nice.org.uk hotjar.com hotjar.io visualwebsiteoptimizer.com vwo.com; object-src 'none'; media-src 'none'; worker-src 'self' blob:");

			// TODO: Add a feature policy header when it's no longer experimental
			// see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy

			await _next(context);
		}
	}
}
