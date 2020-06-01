using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;

namespace CKS.Web.Controllers
{
	[Route("/[controller]")]
	public class ErrorTest : ControllerBase
	{
		[HttpGet]
		public HttpResponseMessage Get()
		{
			throw new Exception("Server Error Test");
		}
	}
}
