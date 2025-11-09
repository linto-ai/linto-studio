# LinTO MCP Server - Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for building native modules if needed
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Copy the local studio-sdk dependency
COPY ../studio-sdk/javascript /app/studio-sdk/javascript

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY server.js ./
COPY index.js ./

# Create upload directory
RUN mkdir -p /tmp/linto-uploads && \
    chown -R node:node /tmp/linto-uploads

# Switch to non-root user
USER node

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Start server
CMD ["node", "server.js"]
