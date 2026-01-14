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

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./config/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create all necessary directories and set permissions for ANY user (world-writable for flexibility)
# This allows running as any UID via --user flag without permission issues
RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /tmp/nginx && \
    # Make directories writable by any user (for --user flexibility)
    chmod -R 777 /var/cache/nginx /tmp/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    # Make html dir writable for config.js generation
    chmod 777 /usr/share/nginx/html && \
    # Make nginx.conf writable for port substitution
    chmod 666 /etc/nginx/nginx.conf

HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

# Default to nginx user (101:101), but can be overridden with:
#   docker run --user 1000:1000 ...
#   or K8s securityContext.runAsUser
USER nginx

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
