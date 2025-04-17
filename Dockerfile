# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Astro"

# Astro app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=10.1.0
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY . .

# Build application
ENV DATABASE_URL=":memory:"
ENV BETTER_AUTH_URL="https://miniastro.dev"
ENV BETTER_AUTH_SECRET="1234567890"
ENV GOOGLE_CLIENT_ID="20953916925-o83cpr5m1tq9ve495norgv0vfl8052tc.apps.googleusercontent.com"
ENV GOOGLE_CLIENT_SECRET="1234567890"
RUN pnpm run build 

# Remove development dependencies

RUN pnpm prune --prod


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/migrations /app/migrations

ENV PORT=4321
ENV HOST=0.0.0.0

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 4321
ENV DATABASE_URL="/data/data.db"
CMD node ./dist/bin/bin.js & node ./dist/server/entry.mjs