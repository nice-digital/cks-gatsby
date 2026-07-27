FROM node:22.11.0-alpine

ENV IN_DOCKER=true

# Install Java (for Allure) see https://stackoverflow.com/a/44154721/486434
RUN apk add openjdk8

# Curl isn't in Alpine and needed to install allure
RUN apk add curl

# Install Allure for generating a report
RUN curl -o allure-2.20.1.tgz -Ls https://repo1.maven.org/maven2/io/qameta/allure/allure-commandline/2.20.1/allure-commandline-2.20.1.tgz \
	&& tar -zxf allure-2.20.1.tgz -C /usr/local --strip-components=1 \
  && rm allure-2.20.1.tgz

RUN mkdir -p /tests

WORKDIR /tests

COPY package.json /tests
COPY package-lock.json /tests

# Token for the CodeArtifact registry, passed in from the host (see docker-compose.yml).
# .npmrc is written and removed within a single RUN so the token never persists in a layer.
ARG NPM_TOKEN_TEMP
RUN echo "registry=https://nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/" > .npmrc \
	&& echo "//nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/:_authToken=${NPM_TOKEN_TEMP}" >> .npmrc \
	&& npm ci \
	&& rm -f .npmrc

COPY . /tests

CMD tail -f /dev/null
