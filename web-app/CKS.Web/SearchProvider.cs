using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using System;
using Newtonsoft.Json;
using NICE.Search.Common.Enums;
using NICE.Search.Common.Urls;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Linq;
using CKS.Web.Models;

namespace CKS.Web
{
	public class SearchHttpClient : ISearchProvider
	{
		private const string KeywordTypeAheadType = "keyword";
		private readonly string _searchApiEnvironmentUri;
		private readonly string _indexToQuery;
		private readonly System.Net.Http.HttpClient _client;

		public SearchHttpClient(string searchApiEnvironmentUri, string indexToQuery, System.Net.Http.HttpClient client)
		{
			_searchApiEnvironmentUri = searchApiEnvironmentUri.EndsWith("/") ?
				searchApiEnvironmentUri.TrimEnd('/') :
				searchApiEnvironmentUri;
			_indexToQuery = indexToQuery;
			_client = client;
		}

		public Document GetDocument(IDocumentUrl url)
		{
			Document document = null;
			url.index = _indexToQuery;
			var searchUri = $"{_searchApiEnvironmentUri}/api/{url.fullUrl}";
			var response = _client.GetAsync(searchUri).Result;

			if (response.IsSuccessStatusCode)
			{
				var jsonResponse = response.Content.ReadAsStringAsync().Result;
				document = JsonConvert.DeserializeObject<Document>(jsonResponse);
			}

			return document;
		}

		public SearchResults Search(ISearchUrl url)

		{
			var searchResults = new SearchResults();

			url.index = _indexToQuery;

			string route = string.Empty;
			if (url.Route != "search")
				route = $"&Route={url.Route}";

			var searchUri = $"{_searchApiEnvironmentUri}/api/{url.fullUrlWithIndex().Replace(url.Route, "search")}{route}";

			var response = _client.GetAsync(searchUri).Result;

			if (response.IsSuccessStatusCode)
			{
				var jSonResponse = response.Content.ReadAsStringAsync().Result;
				searchResults = JsonConvert.DeserializeObject<SearchResults>(jSonResponse);
			}

			return searchResults;
		}

		public TypeAheadResults TypeAhead(ISearchUrl url)
		{
			var typeaheadResults = new TypeAheadResults();
			url.index = _indexToQuery;
			var route = ReplaceRoute("typeahead/all", url);
			var searchUri = $"{_searchApiEnvironmentUri}/api/{route}";
			var response = _client.GetAsync(searchUri).Result;

			if (response.IsSuccessStatusCode)
			{
				var jsonResponse = response.Content.ReadAsStringAsync().Result;
				Console.WriteLine(searchUri);
				Console.WriteLine(jsonResponse);
				typeaheadResults = JsonConvert.DeserializeObject<TypeAheadResults>(jsonResponse);
			}
			return typeaheadResults;
		}
		private string GetLink(TypeAhead typeAheadResult)
		{
			// Assume that 'keyword' results go direct to the SERP (ie /search/?q=TERM) and other types (e.g. topic or scenario) go direct to a path
			return typeAheadResult.TypeAheadType == KeywordTypeAheadType
				|| string.IsNullOrEmpty(typeAheadResult.TypeAheadLink)
				? new SearchUrl { Route = "/search/", q = typeAheadResult.Title }.ToString()
				: typeAheadResult.TypeAheadLink;
		}

		//Note this method is not longer actually required but still needs implementing in order to
		//ensure backward compatability with the legacy client
		public SearchHttpClient WithDefaultFieldCollapsing(FieldCollapsing defaultCollapse)
		{
			throw new NotImplementedException();
		}

		protected string ReplaceRoute(string newRoute, ISearchUrl url)
		{
			return url.fullUrlWithIndex().Replace("search", newRoute);
			/*
			if (!string.IsNullOrWhiteSpace(newRoute))
				if (url.fullUrlWithIndex().StartsWith(((PropertyPushingUrl)url).Route))
					return url.fullUrlWithIndex().Replace(((PropertyPushingUrl)url).Route, newRoute);

			return url.fullUrlWithIndex();
			*/
		}
	}
}
