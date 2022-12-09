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
			//ContentTypeProvider = new PWAFileExtensionContentTypeProvider();
			OnPrepareResponse = PrepareResponse;
		}

		private static readonly Action<StaticFileResponseContext> PrepareResponse = responseContext =>
		{
			var request = responseContext.Context.Request;
			var response = responseContext.Context.Response;

			if (request.Path == "/404.html")
				response.StatusCode = 404;
		};
	}
}
