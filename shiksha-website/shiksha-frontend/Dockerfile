# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

# Production build
RUN npm run build -- --configuration production --base-href /

# -------- Stage 2: Runtime --------
FROM caddy:2-alpine

# Copy only built output
COPY --from=builder /app/dist/shiksha-frontend /srv

EXPOSE 8000

CMD ["caddy", "file-server", "--listen", ":8000", "--root", "/srv"]