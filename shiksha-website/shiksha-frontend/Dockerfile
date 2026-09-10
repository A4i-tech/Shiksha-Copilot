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

# Built Angular output + runtime-config tooling
COPY --from=builder /app/dist/shiksha-frontend /srv
COPY docker-entrypoint.sh render-env.sh /
COPY nginx.conf /etc/nginx/nginx.conf

# Move the env template out of the served web root so it's never publicly
# fetchable with its ${...} placeholders visible. The entrypoint renders it
# from here into /srv/assets/env.js on start; keeping it here (not in /srv)
# means a container restart still has a template to render from.
RUN mkdir -p /etc/shiksha \
    && mv /srv/assets/env.template.js /etc/shiksha/env.template.js

# nginx runs fully non-root on :8000 — master and workers are both appuser,
# so every path nginx writes (pid, temp dirs) has to live under a dir
# appuser owns. /srv/assets/env.js is (re)written by the entrypoint on
# every container start.
RUN mkdir -p /tmp/nginx \
    && chown -R appuser:appuser /srv /tmp/nginx \
    && chmod +x /docker-entrypoint.sh /render-env.sh

USER appuser

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
