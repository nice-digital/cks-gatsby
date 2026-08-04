FROM node:24.18.1-alpine

ENV IN_DOCKER=true

# Node >= 22.12 enables require(esm), which breaks cucumber 9 loading wdio's
# top-level-await formatter. Disable it.
ENV NODE_OPTIONS="--no-experimental-require-module"

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
ARG NPM_TOKEN
RUN echo "registry=https://nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/" > .npmrc \
	&& echo "//nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/:_authToken=${NPM_TOKEN}" >> .npmrc \
	&& npm ci \
	&& rm -f .npmrc

COPY . /tests

CMD tail -f /dev/null
