# -------- Stage 1: Build --------
FROM node:22-alpine AS builder

WORKDIR /app

# Defaults keep a plain `docker build` usable for local dev; CI/CD overrides
# these via --build-arg to bake in real values for staging/prod images.
ARG BUILD_CONFIGURATION=development
ARG BACKEND_URL=your_backend_url
ARG TURNSTILE_SITE_KEY=your_turnstile_site_key

COPY package*.json ./
RUN npm ci --silent

COPY . .

RUN find src/environments -name "environment*.ts" \
      -exec sed -i "s|your_backend_url|${BACKEND_URL}|g" {} \; \
      -exec sed -i "s|your_turnstile_site_key|${TURNSTILE_SITE_KEY}|g" {} \;

RUN npm run build -- --configuration ${BUILD_CONFIGURATION} --base-href /

# -------- Stage 2: Runtime --------
FROM caddy:2-alpine

# Copy only built output
COPY --from=builder /app/dist/shiksha-frontend /srv

EXPOSE 8000

CMD ["caddy", "file-server", "--listen", ":8000", "--root", "/srv"]