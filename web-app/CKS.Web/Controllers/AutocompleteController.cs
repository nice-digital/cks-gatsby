using CKS.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using NICE.Search.Common.Urls;
using System;
using System.Linq;
using System.Text.Json;

namespace CKS.Web.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class AutocompleteController : ControllerBase
	{
		private const string KeywordTypeAheadType = "keyword";

		private readonly ILogger<AutocompleteController> _logger;
		private readonly ISearchProvider _provider;

		public AutocompleteController(ILogger<AutocompleteController> logger, ISearchProvider provider)
		{
			_logger = logger;
			_provider = provider;
		}

		/// <summary>
		/// Gets a list of autocomplete suggestions for use in the global nav search box.
		/// See <a href="https://github.com/nice-digital/global-nav#headersearchautocomplete">global nav docs</a> for more information
		/// </summary>
		/// <param name="searchUrl">The URL, containing the search term in the q parameter</param>
		/// <returns>A list of autocomplete suggestions</returns>
		[HttpGet]
		public JsonResult Get([FromQuery] SearchUrl searchUrl)
		{
			var search = _provider.TypeAhead(searchUrl);

			if (search.Failed)
			{
				_logger.LogError("Autocomplete exception - {errorMessage}. Search url - {searchUrl}.",
					search.ErrorMessage,
					searchUrl
					);

				return new JsonResult(Enumerable.Empty<object>()) { StatusCode = 500 };
			}

			var autoCompleteResponses = from result in search.Results
										select new AutocompleteItemResponse
										{
											Title = result.Title,
											TypeAheadType = result.TypeAheadType,
											Link = GetLink(result)
										};

			// Use Capitalized property names, rather than the default camel cased as this is what global nav looks for
			return new JsonResult(autoCompleteResponses, new JsonSerializerOptions { PropertyNamingPolicy = null });
		}

		/// <summary>
		/// Gets a list of autocomplete suggestions for use with open search.
		/// </summary>
		/// <param name="searchUrl"></param>
		/// <returns></returns>
		[HttpGet]
		[Route("opensearch")]
		public JsonResult GetOpenSearchSuggestions([FromQuery] SearchUrl searchUrl)
		{
			var search = _provider.TypeAhead(searchUrl);

			if (search.Failed)
			{
				_logger.LogError("Opensearch autocomplete exception - {errorMessage}. Search url - {searchUrl}.",
					search.ErrorMessage,
					searchUrl
					);

				return new JsonResult(new object[] { searchUrl.q, Enumerable.Empty<string>(), Enumerable.Empty<string>(), Enumerable.Empty<string>() }) { StatusCode = 500 };
			}

			// Open search suggestions have this weird nested list format
			// https://github.com/dewitt/opensearch/blob/master/mediawiki/Specifications/OpenSearch/Extensions/Suggestions/1.1/Draft%201.wiki
			var results = new object[] {
				// Query String
				searchUrl.q,
				// Completions
				search.Results.Select(r => r.Title),
				// Descriptions - we don't have any but the opensearch spec wants them so we just re-use the title
				search.Results.Select(r => r.Title),
				// Query URLs
				search.Results.Select(r => GetLink(r)) };

			// Custom mime type for opensearch suggestions
			return new JsonResult(results) { ContentType = "application/x-suggestions+json" };
		}

		private string GetLink(TypeAhead typeAheadResult)
		{
			// Assume that 'keyword' results go direct to the SERP (ie /search/?q=TERM) and other types (e.g. topic or scenario) go direct to a path
			return typeAheadResult.TypeAheadType == KeywordTypeAheadType
				|| string.IsNullOrEmpty(typeAheadResult.TypeAheadLink)
				? new SearchUrl { Route = "/search/", q = typeAheadResult.Title }.ToString()
				: typeAheadResult.TypeAheadLink;
		}

	}
}
