FROM node:lts-alpine

WORKDIR /workspace

ENV DB_PATH=/workspace/data/database.db
ENV SERVER_PORT=3001
ENV SERVER_HOST=0.0.0.0
ENV CORS_ORIGIN=http://localhost:3000

ADD ./dist ./dist
ADD ./node_modules ./node_modules
ADD ./migrations ./migrations
ADD ./package.json ./

RUN mkdir data

VOLUME [ "/workspace/data" ]

CMD [ "node", "/workspace/dist/index.js" ]