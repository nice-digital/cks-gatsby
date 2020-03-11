FROM node:10

ENV IN_DOCKER=true

RUN mkdir -p /tests

WORKDIR /tests

COPY package.json /tests
COPY package-lock.json /tests

RUN npm ci

COPY . /tests

CMD tail -f /dev/null
