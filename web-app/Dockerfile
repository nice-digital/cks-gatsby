FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

ENV ASPNETCORE_URLS http://+:8080

WORKDIR /app

EXPOSE 8080

# Make sure yout mount a volume into the /app folder
ENTRYPOINT ["dotnet", "CKS.Web.dll"]
