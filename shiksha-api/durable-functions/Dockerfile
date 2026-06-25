# syntax=docker/dockerfile:1
# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/python:4-python3.11-appservice

# 1) Base off the official Azure Functions Python 3.11 image
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# 2) Enable console logging for easier debug
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    VIRTUAL_ENV=/home/site/wwwroot/.venv \
    PATH="/home/site/wwwroot/.venv/bin:$PATH" \
    UV_LINK_MODE=copy

# 3) Install uv into the container
COPY --from=ghcr.io/astral-sh/uv:0.8.17 /uv /uvx /bin/

# 4) Set the working directory where the Functions host expects your code
WORKDIR /home/site

# 5) Copy dependency manifests first (for Docker layer caching)
COPY shiksha-api/durable-functions/pyproject.toml shiksha-api/durable-functions/uv.lock* ./wwwroot/

# 6) Copy the shared local path dependency metadata so uv can resolve it
COPY components/rag-wrapper/pyproject.toml /home/components/rag-wrapper/pyproject.toml

WORKDIR /home/site/wwwroot

# 7) Install only non-dev (runtime) dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-package vellm-rag-wrapper

# 8) Copy source code and install the shared local path dependency
COPY components/rag-wrapper /home/components/rag-wrapper
COPY shiksha-api/durable-functions ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# 9) The Functions base image already sets ENTRYPOINT/CMD to launch the host
