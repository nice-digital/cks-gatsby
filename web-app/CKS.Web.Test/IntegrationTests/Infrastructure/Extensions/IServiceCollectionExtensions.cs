using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace CKS.Web.Test.IntegrationTests.Infrastructure.Extensions
{
	public static class IServiceCollectionExtensions
	{
		public static void ReplaceService<TService>(this IServiceCollection serviceCollection, TService implementation)
		{
			ServiceDescriptor descriptor =
						new ServiceDescriptor(
							typeof(TService), implementation);

			serviceCollection.Replace(descriptor);
		}
	}
}
