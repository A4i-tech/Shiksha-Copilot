# -------- Stage 1: Build --------
FROM node:22-alpine AS builder

WORKDIR /app

# Runtime config (BACKEND_URL etc.) is injected by docker-entrypoint.sh, not a build-arg.
ARG BUILD_CONFIGURATION=development

COPY package*.json ./
RUN npm ci --silent

COPY . .

RUN npm run build -- --configuration ${BUILD_CONFIGURATION} --base-href /

# -------- Stage 2: Runtime --------
FROM nginx:1.27-alpine

RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

COPY --from=builder /app/dist/shiksha-frontend /srv
COPY docker-entrypoint.sh render-env.sh /
COPY nginx.conf /etc/nginx/nginx.conf

# Template lives outside /srv so it's never served; entrypoint renders it
# into /srv/assets/env.js on start (restart re-renders from here).
RUN mkdir -p /etc/shiksha \
    && mv /srv/assets/env.template.js /etc/shiksha/env.template.js

# nginx runs non-root on :8000, so pid/temp dirs must be appuser-owned.
RUN mkdir -p /tmp/nginx \
    && chown -R appuser:appuser /srv /tmp/nginx \
    && chmod +x /docker-entrypoint.sh /render-env.sh

USER appuser

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
