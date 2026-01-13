# Stage 1: Build the Vue.js application
FROM node:22.14.0 as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install gosu for user switching
RUN apk add --no-cache gosu

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./config/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run/nginx.pid /usr/share/nginx/html

HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost || exit 1

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
