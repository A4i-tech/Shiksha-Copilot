# -------- Stage 1: Build --------
FROM node:24-alpine AS builder

WORKDIR /app

# Runtime config (BACKEND_URL etc.) is injected by the deployment target, not a build-arg.
ARG BUILD_CONFIGURATION=development

COPY package*.json ./
RUN npm ci

COPY . .

# prebuild's ensure-env (package.json) would otherwise bake env.example.js's
# dummy defaults into dist/assets/env.js; strip it so the deployment target's
# real value is the only one that can ever be served.
RUN npm run build -- --configuration ${BUILD_CONFIGURATION} --base-href / \
    && rm -f dist/shiksha-frontend/assets/env.js

# -------- Stage 2: Runtime --------
FROM nginx:1.30.5-alpine

RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

COPY --from=builder /app/dist/shiksha-frontend /srv
COPY nginx.conf /etc/nginx/nginx.conf

# No assets/env.js baked in, the deployment target supplies it, and nginx
# never writes anywhere under /srv -- it only needs to be readable, which
# the builder stage's COPY already leaves world-readable. Only /tmp/nginx
# (pid/scratch dirs) genuinely needs appuser ownership.
RUN mkdir -p /tmp/nginx \
    && chown -R appuser:appuser /tmp/nginx

USER appuser

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]