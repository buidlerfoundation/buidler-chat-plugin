FROM node:lts-alpine AS deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts-alpine AS builder
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn build

FROM node:lts-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT 3003
COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
EXPOSE 3002
CMD ["node_modules/.bin/next", "start"]