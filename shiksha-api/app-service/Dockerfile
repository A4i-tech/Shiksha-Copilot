# syntax=docker/dockerfile:1
FROM python:3.11.9-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    UV_LINK_MODE=copy

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    git \
    libmagic-dev \
    libreoffice \
    libreoffice-impress \
    fonts-dejavu \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:0.8.17 /uv /uvx /bin/

WORKDIR /src

COPY components/rag-wrapper/pyproject.toml ./components/rag-wrapper/pyproject.toml
COPY shiksha-api/app-service/pyproject.toml shiksha-api/app-service/uv.lock ./shiksha-api/app-service/

WORKDIR /src/shiksha-api/app-service

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project --no-install-package vellm-rag-wrapper

WORKDIR /src

COPY components/rag-wrapper ./components/rag-wrapper
COPY shiksha-api/app-service ./shiksha-api/app-service

WORKDIR /src/shiksha-api/app-service

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

ARG SHIKSHA_COPILOT_BUILD
ENV SHIKSHA_COPILOT_BUILD=$SHIKSHA_COPILOT_BUILD

EXPOSE 5000

CMD ["sh", "-c", "uv run --no-sync python -m app.main --host 0.0.0.0 --port ${PORT:-5000}"]
