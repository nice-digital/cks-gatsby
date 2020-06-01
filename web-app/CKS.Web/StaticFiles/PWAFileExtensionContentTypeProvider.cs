using Microsoft.AspNetCore.StaticFiles;

namespace CKS.Web.StaticFiles
{
	/// <summary>
	/// A custom content type provider for use within UseStaticFiles middleware.
	/// Because https://github.com/dotnet/aspnetcore/issues/2442 isn't in .NET Core 3.1.
	/// </summary>
	/// <remarks>
	/// Without this, any .webmanifest file returns a 404.
	/// </remarks>
	public class PWAFileExtensionContentTypeProvider : FileExtensionContentTypeProvider
	{
		public PWAFileExtensionContentTypeProvider()
		{
			Mappings.Add(".webmanifest", "application/manifest+json");
		}
	}
}
