# development stage

FROM node:lts-alpine3.14 As development

WORKDIR /usr/src/app

COPY package*.json .npmrc ./

RUN npm install

COPY . .

RUN npm run build


# production stage

FROM node:lts-alpine3.14 as production

#ARG NODE_ENV=production

#ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .npmrc ./

# Work around for husky
RUN npm set-script prepare ''

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
