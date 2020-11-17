using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Net.Http.Headers;

namespace CKS.Web.StaticFiles
{
	public class GatsbyStaticFileOptions : StaticFileOptions
	{
		public GatsbyStaticFileOptions()
		{
			ContentTypeProvider = new PWAFileExtensionContentTypeProvider();
			OnPrepareResponse = PrepareGatsbyResponse;
		}

		/// <summary>
		/// Set the correct response cache headers and statuses for Gatsby static files (as per <a href="https://www.gatsbyjs.org/docs/caching/ ">the Gatsby docs</a>).
		/// </summary>
		/// <remarks>
		/// See https://www.gatsbyjs.org/docs/caching/ for details on Gatsby caching.
		/// Files in /static and files with generated unique (hashed) file names should be cached forever.
		/// Files with persistant names across builds shouldn't be cached forever eg. json, html, xml
		/// </remarks>
		private static readonly Action<StaticFileResponseContext> PrepareGatsbyResponse = responseContext =>
		{
			var fileName = responseContext.File.Name;
			var request = responseContext.Context.Request;
			var response = responseContext.Context.Response;

			if (request.Path == "/404.html")
				response.StatusCode = 404;

			if (fileName.EndsWith(".html"))
				response.Headers.Add("Link",
					"<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin," +
					"<https://www.googletagmanager.com>; rel=preconnect," +
					"<https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel=preload; as=script");

			if (fileName.EndsWith(".css") ||
				request.Path.Value.Contains("/static/") ||
				(fileName.EndsWith(".js") && fileName != "sw.js"))
			{
				response.Headers[HeaderNames.CacheControl] = "public,immutable,max-age=31536000";
			}
			else
				response.Headers[HeaderNames.CacheControl] = "public,must-revalidate,max-age=0";
		};
	}
}
