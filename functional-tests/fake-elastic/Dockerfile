FROM node:12

COPY package.json /tests
COPY package-lock.json /tests

RUN npm ci

COPY . /tests
