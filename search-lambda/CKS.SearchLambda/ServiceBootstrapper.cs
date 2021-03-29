using System;
using System.Collections.Generic;
using System.Text;
using NICE.Search.Common.Enums;
using NICE.Search.Common.Interfaces;
using NICE.Search.Providers;

namespace CKS.SearchLambda
{
	public static class ServiceBootstrapper
	{
		public static ISearchProvider CreateInstance()
		{
			return new SearchProvider(ApplicationEnvironment.CKSTest);
		}

	}
}
