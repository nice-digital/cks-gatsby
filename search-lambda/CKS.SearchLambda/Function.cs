using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using NICE.Search.Common.Interfaces;
using NICE.Search.Common.Urls;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace CKS.SearchLambda
{
    public class Function
    {
	    public static readonly int DEFAULT_PAGE_SIZE = 15;
	    public static readonly int MIN_PAGE_SIZE = 10;

	    private readonly ISearchProvider _searchProvider;
	    public Function(ISearchProvider searchProvider)
	    {
		    _searchProvider = searchProvider;
	    }

	    public Function()
		    : this(ServiceBootstrapper.CreateInstance())
	    { }

	    public APIGatewayHttpApiV2ProxyResponse FunctionHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
	    {
		    var searchUrl = new SearchUrl();

		    searchUrl.ps = searchUrl.ps.HasValue ? Math.Max(searchUrl.ps.Value, MIN_PAGE_SIZE) : DEFAULT_PAGE_SIZE;

		    var search = _searchProvider.Search(searchUrl);
		    int statusCode = 200;

		    if (search.Failed)
		    {
			    // _logger.LogError("Search exception - {errorMessage}. Search url - {searchUrl}.",
			    // 	search.ErrorMessage,
			    // 	searchUrl
			    // );

			    statusCode = 500;
		    }

		    var response = new APIGatewayHttpApiV2ProxyResponse
		    {
			    StatusCode = statusCode,
			    Body = JsonSerializer.Serialize(search)
		    };

		    return response;
	    }
	}
}
