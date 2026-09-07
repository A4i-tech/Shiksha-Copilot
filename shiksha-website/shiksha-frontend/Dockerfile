# -------- Stage 1: Build --------
FROM node:22-alpine AS builder

WORKDIR /app

# Defaults keep a plain `docker build` usable for local dev; CI/CD overrides
# these via --build-arg to bake in real values for staging/prod images.
ARG BUILD_CONFIGURATION=development
ARG BACKEND_URL=your_backend_url
ARG TURNSTILE_SITE_KEY=your_turnstile_site_key
ARG SUPERSET_URL=your_superset_url
ARG SUPERSET_DASHBOARD_UUID=your_superset_dashboard_uuid
ARG SUPERSET_MOBILE_DASHBOARD_UUID=your_superset_mobile_dashboard_uuid

COPY package*.json ./
RUN npm ci --silent

COPY . .

RUN find src/environments -name "environment*.ts" \
      -exec sed -i "s|your_backend_url|${BACKEND_URL}|g" {} \; \
      -exec sed -i "s|your_turnstile_site_key|${TURNSTILE_SITE_KEY}|g" {} \; \
      -exec sed -i "s|your_superset_url|${SUPERSET_URL}|g" {} \; \
      -exec sed -i "s|your_superset_dashboard_uuid|${SUPERSET_DASHBOARD_UUID}|g" {} \; \
      -exec sed -i "s|your_superset_mobile_dashboard_uuid|${SUPERSET_MOBILE_DASHBOARD_UUID}|g" {} \;

RUN npm run build -- --configuration ${BUILD_CONFIGURATION} --base-href /

# -------- Stage 2: Runtime --------
FROM caddy:2-alpine

RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

# Copy only built output
COPY --from=builder /app/dist/shiksha-frontend /srv

RUN mkdir -p /config/caddy /data/caddy \
    && chown -R appuser:appuser /srv /config /data

# caddy ships cap_net_bind_service for binding :80/:443 as root; we listen on
# :8000 and drop all capabilities at the container level, so exec fails
# unless the file capability is stripped too.
RUN apk add --no-cache libcap && setcap -r /usr/bin/caddy && apk del libcap

USER appuser

EXPOSE 8000

CMD ["caddy", "file-server", "--listen", ":8000", "--root", "/srv"]