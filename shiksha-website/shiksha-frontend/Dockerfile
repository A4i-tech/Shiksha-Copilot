# -------- Stage 1: Build --------
FROM node:24-alpine AS builder

WORKDIR /app

# Runtime config (BACKEND_URL etc.) is injected by the deployment target, not a build-arg.
ARG BUILD_CONFIGURATION=development

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration ${BUILD_CONFIGURATION} --base-href /

# -------- Stage 2: Runtime --------
FROM nginx:1.27-alpine

RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

COPY --from=builder /app/dist/shiksha-frontend /srv
COPY nginx.conf /etc/nginx/nginx.conf

# No assets/env.js baked in, the deployment target supplies it.
# nginx runs non-root on :8000, so pid/temp dirs must be appuser-owned.
RUN mkdir -p /tmp/nginx \
    && chown -R appuser:appuser /srv /tmp/nginx

USER appuser

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]