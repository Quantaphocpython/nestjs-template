# Multi-stage build for optimal image size
FROM node:lts-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# libc6-compat is required for some native modules
# wget and openssl are needed for some packages during installation
# no-cache to keep the image size small
RUN apk add --no-cache libc6-compat wget openssl 
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
# --frozen-lockfile ensures that the exact versions in pnpm-lock.yaml are installed
# --production=false installs both production and development dependencies
RUN pnpm install --frozen-lockfile --production=false

# Build the source code
FROM base AS builder

# install wget and openssl for build steps
# wget supports downloading files using HTTP, HTTPS, and FTP protocols
RUN apk add --no-cache wget openssl 
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and build application
RUN pnpm prisma:generate
RUN pnpm proto:generate
RUN pnpm build

# Production image, copy all the files and run the app
FROM base AS runner
# install wget and openssl for build steps
# wget supports downloading files using HTTP, HTTPS, and FTP protocols
RUN apk add --no-cache wget openssl
WORKDIR /app

# Create a system group with GID 1001
RUN addgroup --system --gid 1001 nodejs 
# Create a system user with UID 1001
RUN adduser --system --uid 1001 nestjs 

# Copy necessary files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy node_modules from deps stage (production only)
COPY --from=deps /app/node_modules ./node_modules

# Change ownership to nestjs user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose ports for HTTP and gRPC
EXPOSE 9001

CMD ["pnpm", "start"]
