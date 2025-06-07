# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install all dependencies (including dev dependencies for potential build steps)
RUN npm ci

# Copy application files
COPY app/ .

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files (excluding node_modules to preserve production dependencies)
COPY --from=builder --chown=nodejs:nodejs /app/app.js ./
COPY --from=builder --chown=nodejs:nodejs /app/*.js ./
# Add any other specific files/directories you need, but NOT the entire /app directory

# Alternative: Copy everything except node_modules
# COPY --from=builder --chown=nodejs:nodejs /app/ ./
# RUN rm -rf node_modules
# RUN npm ci --only=production

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "app.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"