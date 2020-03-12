FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

ENV ASPNETCORE_URLS http://+:8080

WORKDIR /app

# Assume the CKS .NET Core app has been published into the /web-app/publish folder
COPY ./publish ./

EXPOSE 8080

ENTRYPOINT ["dotnet", "CKS.Web.dll"]
