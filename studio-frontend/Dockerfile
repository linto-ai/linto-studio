# Stage 1: Install dependencies (recreate monorepo structure so file:.. resolves)
FROM node:22.14.0 AS deps
WORKDIR /app
COPY studio-sdk/components/editor studio-sdk/components/editor
COPY studio-frontend/package*.json studio-frontend/
WORKDIR /app/studio-frontend
RUN npm ci

# Stage 2: Build the Vue.js application
FROM node:22.14.0 AS builder
WORKDIR /app
COPY --from=deps /app /app
COPY studio-frontend/ /app/studio-frontend/
WORKDIR /app/studio-frontend
RUN npm run build

# Stage 3: Serve with nginx (rootless)
FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=builder --chown=nginx:nginx /app/studio-frontend/dist /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /app/studio-frontend/config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=nginx:nginx /app/studio-frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp \
             /tmp/nginx && \
    chown -R nginx:nginx /var/cache/nginx /tmp/nginx /usr/share/nginx/html

HEALTHCHECK CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

USER nginx
EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
