
FROM node:18-alpine AS builder
LABEL author="nphuy <nghuy31203@gmail.com>"

WORKDIR /app

EXPOSE 3000

WORKDIR /home/nextjs/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
RUN npx browserslist@latest --update-db
RUN npx next telemetry disable

# Install Linux-specific SWC builds
RUN yarn add -D @swc/cli @swc/core

COPY . .

RUN yarn build:uat

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD ["yarn", "start:uat"]