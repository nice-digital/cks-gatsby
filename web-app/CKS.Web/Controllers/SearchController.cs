using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CKS.Web.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class SearchController : ControllerBase
	{
		private readonly ILogger<SearchController> _logger;

		public SearchController(ILogger<SearchController> logger)
		{
			_logger = logger;
		}

		[HttpGet]
		public object Get()
		{
			return new
			{
				Failed = false,
				ResultCount = 26,
				RolledUpCount = 26,
				UnrolledCount = 26,
				PageSize = 10,
				FirstResult = 1,
				LastResult = 10,
				FinalSearchText = "acne",
				FinalSearchTextNoStopWords = "acne",
				PagerLinks = new
				{
					Pages = new[] {
						new {
							Title = "1",
							url = new {
								fullUrl = "search?pa=1&q=acne"
							},
							IsCurrent = true
						},
						new {
							Title = "2",
							url = new {
								fullUrl = "search?pa=2&q=acne"
							},
							IsCurrent = false
						}
					}
				},
				Documents = new[] {
					new {
						Id = "651475",
						PathAndQuery = "/acne-vulgaris",
						Teaser = "Acne vulgaris is a chronic skin condition in which blockage or inflammation of the hair follicles and accompanying sebaceous glands",
						Title = "<b>Acne</b> vulgaris",
					},
					new {
						Id = "651781",
						PathAndQuery = "/rosacea-acne",
						Teaser = "Acne rosacea is a chronic relapsing skin condition affecting the face, characterized by episodes of facial flushing, erythema, telangiectasia.",
						Title = "Rosacea - <b>acne</b>",
					}
				}
			};
		}
	}
}
