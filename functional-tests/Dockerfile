FROM node:12

ENV IN_DOCKER=true

# Install Java (for Allure) see https://stackoverflow.com/a/44154721/486434
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
		#apt-get install -y software-properties-common && \
    apt-get install -y default-jre-headless

# Install Allure for generating a report
RUN curl -o allure-2.13.7.tgz -Ls https://repo1.maven.org/maven2/io/qameta/allure/allure-commandline/2.13.7/allure-commandline-2.13.7.tgz \
	&& tar -zxf allure-2.13.7.tgz -C /usr/local --strip-components=1 \
  && rm allure-2.13.7.tgz

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /tests

WORKDIR /tests

COPY package.json /tests
COPY package-lock.json /tests

RUN npm ci

COPY . /tests

CMD tail -f /dev/null
