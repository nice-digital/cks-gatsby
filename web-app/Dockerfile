FROM mcr.microsoft.com/dotnet/aspnet:6.0

ENV ASPNETCORE_URLS http://+:8080

# Make sure you mount the published web-app as a volume into the /app folder
WORKDIR /app

EXPOSE 8080

RUN apt-get update && apt-get install curl -y

# Download wait-for-it as binary waitforit, see  https://github.com/vishnubob/wait-for-it
ENV WAITFORIT_VERSION db04971
ENV WAITFORIT_DOWNLOAD_SHA dd7511b88c5eaf3f8953167ab498f66589143649142a9a2f49a8f33e08584aaf
ENV WAITFORIT_DOWNLOAD_URL https://github.com/vishnubob/wait-for-it/archive/$WAITFORIT_VERSION.tar.gz
RUN curl -SL "$WAITFORIT_DOWNLOAD_URL" --output waitforit.tar.gz \
	&& echo "$WAITFORIT_DOWNLOAD_SHA waitforit.tar.gz" | sha256sum -c - \
	&& mkdir -p /usr/local/waitforit \
	&& tar -xzf "waitforit.tar.gz" -C /usr/local/waitforit --strip-components=1 \
	&& rm waitforit.tar.gz \
	&& mv /usr/local/waitforit/wait-for-it.sh /usr/local/bin/waitforit \
	&& chmod +x /usr/local/bin/waitforit \
	&& rm -rf /usr/local/waitforit

# Wait for ElasticSearch to be running before we run the web app
ENTRYPOINT ["waitforit", "-t", "60", "--strict", "dev-es.nice.org.uk:9200", "--", "dotnet", "CKS.Web.dll"]
