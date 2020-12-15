using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace aws_cks_lambda_demo
{
    public class Function
    {
	    /// <summary>
	    /// A simple function that takes a string and does a ToUpper
	    /// </summary>
	    /// <param name="request"></param>
	    /// <param name="context"></param>
	    /// <returns></returns>
	    public APIGatewayHttpApiV2ProxyResponse GetUpperCaseHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
        {
	        var inputQueryStringParameter = request.QueryStringParameters["input"];
	        var response = new APIGatewayHttpApiV2ProxyResponse
	        {
		        Body = inputQueryStringParameter?.ToUpper(),
				StatusCode = 200
	        };

	        return response;

        }
    }
}
