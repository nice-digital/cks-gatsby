using Newtonsoft.Json;
using Shouldly;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace CKS.Web.Test.IntegrationTests.TestResponseExtensions
{
	public static class Formatter
	{
		public static string FormatJson(string json)
		{
			dynamic parsedJson = JsonConvert.DeserializeObject(json);
			return JsonConvert.SerializeObject(parsedJson, Formatting.Indented);
		}
	}
}
