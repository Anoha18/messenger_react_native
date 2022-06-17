FROM node:16-alpine AS install_dependecies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./package.json
RUN npm i

FROM node:16-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
COPY --from=install_dependecies /app/node_modules ./node_modules
COPY --from=install_dependecies /app/package.json ./package.json
COPY config.prod.js ./src/config.js
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

FROM node:16-alpine AS start
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=install_dependecies /app/node_modules ./node_modules
COPY --from=install_dependecies /app/package.json ./package.json
COPY --from=build /app .
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=4096
CMD ["npm", "start"]