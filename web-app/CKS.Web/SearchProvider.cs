using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Models;
using Newtonsoft.Json;
using System;

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
				var jsonResponse = response.Content.ReadAsStringAsync().Result;
				searchResults = JsonConvert.DeserializeObject<SearchResults>(jsonResponse.ToString());
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
				typeaheadResults = JsonConvert.DeserializeObject<TypeAheadResults>(jsonResponse);
			}
			return typeaheadResults;
		}
		
		protected string ReplaceRoute(string newRoute, ISearchUrl url)
		{
			return url.fullUrlWithIndex().Replace("search", newRoute);
		}
	}
}
