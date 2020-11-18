FROM node:12

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm ci

COPY . /app

# Use default ElasticSearch port
EXPOSE 9200

CMD [ "npm", "start" ]
