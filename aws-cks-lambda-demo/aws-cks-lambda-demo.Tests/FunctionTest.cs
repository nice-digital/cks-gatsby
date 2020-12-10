using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.Lambda.APIGatewayEvents;
using Xunit;
using Amazon.Lambda.Core;
using Amazon.Lambda.Serialization.SystemTextJson;
using Amazon.Lambda.TestUtilities;
using aws_cks_lambda_demo;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace aws_cks_lambda_demo.Tests
{
	public class FunctionTest
	{
		// This utility method takes care of removing the BOM that System.Text.Json doesn't like.
		private MemoryStream LoadJsonTestFile(string filename)
		{
			var json = File.ReadAllText(filename);
			return new MemoryStream(UTF8Encoding.UTF8.GetBytes(json));
		}

		[Fact]
		public void TestGetUpperCaseHandler()
		{

			// // Invoke the lambda function and confirm the string was upper cased.
			// var function = new Function();
			// var context = new TestLambdaContext();
			// var upperCase = function.GetUpperCaseHandler("hello world", context);
			//
			// Assert.Equal("HELLO WORLD", upperCase);
		}
		[Fact]
		public void HttpApiV2Format()
		{
			var fileStream = File.ReadAllText("http-api-v2-request.json");

			var jsonSerializerOptions = new JsonSerializerOptions
			{
				PropertyNameCaseInsensitive = true
			};

			var request = JsonSerializer.Deserialize<APIGatewayHttpApiV2ProxyRequest>(fileStream, jsonSerializerOptions);

			var function = new Function();
			var context = new TestLambdaContext();
			var response = function.GetUpperCaseHandler(request, context);

			Assert.Equal(1, request.QueryStringParameters.Count);
			Assert.Equal("testingtesting", request.QueryStringParameters["input"]);

			Assert.Equal("TESTINGTESTING", response);

		}
	}
}
