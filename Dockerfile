FROM node:14.18-alpine As development

ARG NPM_TOKEN

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./
COPY .env ./

RUN echo "@wodo-platform:registry=https://npm.pkg.github.com/" > .npmrc 
RUN echo "registry=https://registry.npmjs.org/" >> .npmrc 
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc && \
    npm install  && \
    rm -f .npmrc

RUN npm run db:generate
COPY . .
RUN npm run build


FROM node:14.18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app

COPY package*.json ./
COPY .env ./

# TODO: find a better way to bundle dependencies with nestjs. 
COPY --from=development /usr/src/app/node_modules ./node_modules

COPY --from=development /usr/src/app/dist ./dist

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

# Start the application
CMD ["npm", "run", "start:prod"]