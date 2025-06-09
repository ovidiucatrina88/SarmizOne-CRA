# Multi-stage Dockerfile for Risk Quantification Platform (External Database)
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Build the client first
RUN npm run build

# Build the server with custom configuration to exclude dev dependencies
RUN node build.config.js

# Production stage
FROM node:18-alpine AS production

# Install runtime dependencies
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY --chown=appuser:nodejs shared ./shared

# Change ownership and switch to non-root user
RUN chown -R appuser:nodejs /app
USER appuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5000}/health || exit 1

# Start the application
CMD ["node", "dist/production.js"]