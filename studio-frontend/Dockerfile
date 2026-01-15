# Stage 1: Build the Vue.js application
FROM node:22.14.0 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx (rootless)
FROM nginx:alpine

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy built files from builder stage WITH correct ownership
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx ./config/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY --chown=nginx:nginx ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create necessary directories with correct permissions for nginx user
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /tmp/nginx && \
    chown -R nginx:nginx /var/cache/nginx /tmp/nginx /usr/share/nginx/html

HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

# Run as nginx user (101:101) - truly rootless
USER nginx

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
