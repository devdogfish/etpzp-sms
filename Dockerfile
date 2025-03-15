FROM oven/bun:alpine AS base

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Stage 1: Install dependencies
FROM base AS deps
# set a path to for the following commands to be run on
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# If it at some point doesn't work anymore, copy the entire directory
# COPY --from=builder /app/.next ./.next

# This is for the `start` script, but when replacing the start command with server.js (also part of the build) I can't access the site on localhost
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["bun", "run", "start"]