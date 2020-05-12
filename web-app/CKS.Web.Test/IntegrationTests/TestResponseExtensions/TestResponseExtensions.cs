using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using Shouldly;
using System.Diagnostics;
using System.Text;
using AngleSharp.Html.Parser;
using AngleSharp.Html;

namespace CKS.Web.Test.IntegrationTests.TestResponseExtensions
{
	public static class TestResponseExtensions
	{
		private const string NewLine = "\r\n";


		public static void StatusCodeIs(this HttpResponseMessage me, HttpStatusCode status)
		{
			me.StatusCode.ShouldBe(status);
		}

		public static void IsOk(this HttpResponseMessage me)
		{
			me.StatusCodeIs(HttpStatusCode.OK);
		}

		public static void ShouldContainText(this HttpResponseMessage httpResponseMessage, string text, Case caseSensitivity = Case.Sensitive)
		{
			var content = httpResponseMessage.Content.ReadAsStringAsync().Result;
			content.ShouldContain(text, caseSensitivity);
		}

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string>[] scrubbers = null,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			var content = httpResponseMessage.Content.ReadAsStringAsync().Result;

			// Prettify HTML documents for easier diffing, and avoiding unnecessary whitespace issues
			if (httpResponseMessage.Content.Headers.ContentType.MediaType == "text/html")
			{
				var parser = new HtmlParser();
				var document = parser.ParseDocument(content);

				var sw = new StringWriter();
				var formatter = new PrettyMarkupFormatter();
				formatter.NewLine = NewLine;
				document.ToHtml(sw, formatter);

				content = sw.ToString();
			}

			ShouldMatchApproved(content, scrubbers, memberName, sourceFilePath);
		}

		public static void ShouldMatchApproved(this string content,
			Func<string, string>[] scrubbers = null,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			//scrubbing changing data such as the current time etc.
			if (scrubbers != null)
			{
				foreach (var scrub in scrubbers)
				{
					content = scrub(content);
				}
			}

			// Remove new lines now we've scrubbed as we'll likely have some now
			content = string.Join(NewLine, content.Split(NewLine.ToCharArray()).Where(s => !string.IsNullOrWhiteSpace(s)));

			var expectedFileDir = Path.GetDirectoryName(sourceFilePath);
			var callingFileNameWithoutExtension = Path.GetFileNameWithoutExtension(sourceFilePath);
			var expectedFileName = $"{callingFileNameWithoutExtension}.{memberName}.approved.txt";

			var expectedFilePath = Path.Combine(expectedFileDir, expectedFileName);

			if (File.Exists(expectedFilePath))
			{
				var expectedText = File.ReadAllText(expectedFilePath, Encoding.UTF8);

				var normalisedExpectedText = expectedText.Replace("\r", "");//normalising line endings.
				var normalisedContent = content.Replace("\r", "");

				if (normalisedExpectedText.Equals(normalisedContent))
				{ //this is the happy path. everything matches, so just exit without throwing and the test will be green.
					return;
				}

			}
			else
			{
				File.WriteAllText(expectedFilePath, "", Encoding.UTF8);
			}

			var actualFilePath = expectedFilePath.Replace(".approved.txt", ".actual.txt");
			File.WriteAllText(actualFilePath, content, Encoding.UTF8);

			var kDiffPath = "C:\\Program Files\\KDiff3\\kdiff3.exe";
			if (File.Exists(kDiffPath))
			{
				Process.Start(kDiffPath, string.Format("{0} {1} -m -o {0} --cs \"CreateBakFiles=0\"", expectedFilePath, actualFilePath));
			}
			else
			{
				var dir = Directory.GetCurrentDirectory();
				var vsDiffPath = Path.GetFullPath(Path.Combine(dir, "Difftools", "vsDiffMerge.exe"));
				Process.Start(vsDiffPath, string.Format("\"{0}\" \"{1}\" /t", expectedFilePath, actualFilePath));
			}

			throw new ShouldMatchApprovedException("String didn't match", actualFilePath, expectedFilePath);
		}

		#region Scrubber overloads

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string> scrubber,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			ShouldMatchApproved(httpResponseMessage, new Func<string, string>[] { scrubber }, memberName, sourceFilePath);
		}

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string> scrubber1,
			Func<string, string> scrubber2,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			ShouldMatchApproved(httpResponseMessage, new Func<string, string>[] { scrubber1, scrubber2 }, memberName, sourceFilePath);
		}

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string> scrubber1,
			Func<string, string> scrubber2,
			Func<string, string> scrubber3,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			ShouldMatchApproved(httpResponseMessage, new Func<string, string>[] { scrubber1, scrubber2, scrubber3 }, memberName, sourceFilePath);
		}

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string> scrubber1,
			Func<string, string> scrubber2,
			Func<string, string> scrubber3,
			Func<string, string> scrubber4,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			ShouldMatchApproved(httpResponseMessage, new Func<string, string>[] { scrubber1, scrubber2, scrubber3, scrubber4 }, memberName, sourceFilePath);
		}

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string> scrubber1,
			Func<string, string> scrubber2,
			Func<string, string> scrubber3,
			Func<string, string> scrubber4,
			Func<string, string> scrubber5,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			ShouldMatchApproved(httpResponseMessage, new Func<string, string>[] { scrubber1, scrubber2, scrubber3, scrubber4, scrubber5 }, memberName, sourceFilePath);
		}

		public static void ShouldMatchApproved(this HttpResponseMessage httpResponseMessage,
			Func<string, string> scrubber1,
			Func<string, string> scrubber2,
			Func<string, string> scrubber3,
			Func<string, string> scrubber4,
			Func<string, string> scrubber5,
			Func<string, string> scrubber6,
			[System.Runtime.CompilerServices.CallerMemberName] string memberName = null,
			[System.Runtime.CompilerServices.CallerFilePath] string sourceFilePath = null)
		{
			ShouldMatchApproved(httpResponseMessage, new Func<string, string>[] { scrubber1, scrubber2, scrubber3, scrubber4, scrubber5, scrubber6 }, memberName, sourceFilePath);
		}

		#endregion
	}
}
