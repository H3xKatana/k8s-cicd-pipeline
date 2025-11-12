# Multi-stage Dockerfile for demo-api server
# Use Node.js 20 slim image as base
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@10.11.1

# Create app directory
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-workspace.yaml turbo.json ./

# Copy workspace packages for proper dependency resolution
COPY packages/ packages/

# Copy the server package.json as well
COPY apps/server/package.json apps/server/package.json

# Install dependencies using pnpm
RUN pnpm install 


# Build stage
FROM base AS builder

# Copy all source code (overwrites previous copies to ensure latest files)
COPY . .

# Generate Prisma client before building
RUN pnpm --filter @demo-api/db db:generate

# Build the project using turbo
RUN pnpm build


# Production stage
FROM node:20-alpine AS production

# Install pnpm globally
RUN npm install -g pnpm@10.11.1

# Create app directory
WORKDIR /app

# Copy package manager files
COPY package.json pnpm-workspace.yaml turbo.json ./

# Copy all packages for proper dependency resolution
COPY packages/ packages/

# Copy the server package.json as well
COPY apps/server/package.json apps/server/package.json

# Install only production dependencies
RUN pnpm install --prod 

# Copy the built application
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Copy any necessary workspace packages that were built
COPY --from=builder /app/packages ./packages


# Expose port 3000
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the server
CMD ["node", "apps/server/dist/index.js"]