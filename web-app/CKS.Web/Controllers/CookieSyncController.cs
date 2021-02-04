using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CKS.Web.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CookieSyncController : ControllerBase
	{
		[HttpGet]
		public JsonResult Get()
		{
			// Set these cookies using a set-cookie http header, in an effort to help with ITP, specifically in safari
			// where cookies get restricted to 7 days
			SetCookie("_ga", 365 * 2);
			SetCookie("_gaexp", 90);

			return new JsonResult(true);
		}

		private void SetCookie(string cookieName, double durationInDays)
		{
			if (Request.Cookies.ContainsKey(cookieName))
			{
				Response.Cookies.Append(
					cookieName,
					Request.Cookies[cookieName],
					new CookieOptions()
					{
						Path = "/",
						MaxAge = TimeSpan.FromDays(durationInDays)
					}
				);
			}
		}
	}
}
