FROM node:18-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm run generate-docs

FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/swagger_output.json ./swagger_output.json

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
