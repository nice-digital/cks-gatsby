using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using NICE.Search.Common.Urls;
using System;
using System.ComponentModel;

namespace CKS.Web.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class SearchController : ControllerBase
	{
		public static readonly int DEFAULT_PAGE_SIZE = 15;
		public static readonly int MIN_PAGE_SIZE = 10;

		private readonly ILogger<SearchController> _logger;
		private readonly ISearchProvider _provider;

		public SearchController(ILogger<SearchController> logger, ISearchProvider provider)
		{
			_logger = logger;
			_provider = provider;
		}

		[HttpGet]
		public JsonResult Get([FromQuery] SearchUrl searchUrl)
		{
			searchUrl.ps = searchUrl.ps.HasValue ? Math.Max(searchUrl.ps.Value, MIN_PAGE_SIZE) : DEFAULT_PAGE_SIZE;

			var search = _provider.Search(searchUrl);
			int statusCode = 200;

			if (search.Failed)
			{
				_logger.LogError("Search exception - {errorMessage}. Search url - {searchUrl}.",
					search.ErrorMessage,
					searchUrl
					);

				statusCode = 500;
			}

			return new JsonResult(search) { StatusCode = statusCode };
		}

	}
}
