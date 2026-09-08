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
FROM caddy:2-alpine

RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser

# Copy only built output
COPY --from=builder /app/dist/shiksha-frontend /srv
COPY docker-entrypoint.sh render-env.sh /
COPY Caddyfile /etc/caddy/Caddyfile

RUN mkdir -p /config/caddy /data/caddy \
    && chown -R appuser:appuser /srv /config /data \
    && chmod +x /docker-entrypoint.sh /render-env.sh

# caddy ships cap_net_bind_service for binding :80/:443 as root; we listen on
# :8000 and drop all capabilities at the container level, so exec fails
# unless the file capability is stripped too.
RUN apk add --no-cache libcap && setcap -r /usr/bin/caddy && apk del libcap

USER appuser

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
