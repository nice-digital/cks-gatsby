FROM node:12-alpine

ENV IN_DOCKER=true

# Install Java (for Allure) see https://stackoverflow.com/a/44154721/486434
RUN apk add openjdk8

# Curl isn't in Alpine and needed to install allure
RUN apk add curl

# Install Allure for generating a report
RUN curl -o allure-2.13.7.tgz -Ls https://repo1.maven.org/maven2/io/qameta/allure/allure-commandline/2.13.7/allure-commandline-2.13.7.tgz \
	&& tar -zxf allure-2.13.7.tgz -C /usr/local --strip-components=1 \
  && rm allure-2.13.7.tgz

RUN mkdir -p /tests

WORKDIR /tests

COPY package.json /tests
COPY package-lock.json /tests

RUN npm ci

COPY . /tests

CMD tail -f /dev/null
