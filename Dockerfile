FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g swagger-jsdoc

RUN npx tsc

RUN swagger-jsdoc -d swaggerDef.js -o dist/swagger.json

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
