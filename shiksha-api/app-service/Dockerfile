# -------- Stage 1: Build --------
FROM python:3.11.9-slim AS builder

ENV PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    git \
    libmagic-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==1.8.3

WORKDIR /src

COPY components/rag-wrapper ./components/rag-wrapper
COPY shiksha-api/app-service/pyproject.toml shiksha-api/app-service/poetry.lock* ./shiksha-api/app-service/

WORKDIR /src/shiksha-api/app-service

RUN poetry install --only main --no-root --no-interaction --no-ansi

WORKDIR /src

COPY shiksha-api/app-service ./shiksha-api/app-service

# -------- Stage 2: Runtime --------
FROM python:3.11.9-slim

ENV PYTHONUNBUFFERED=1 \
    PATH="/src/shiksha-api/app-service/.venv/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    libreoffice-impress \
    fonts-dejavu \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1000 appuser \
    && useradd --uid 1000 --gid appuser --create-home --shell /bin/bash appuser

WORKDIR /src

COPY --from=builder --chown=appuser:appuser /src/components/rag-wrapper ./components/rag-wrapper
COPY --from=builder --chown=appuser:appuser /src/shiksha-api/app-service ./shiksha-api/app-service

WORKDIR /src/shiksha-api/app-service

ARG SHIKSHA_COPILOT_BUILD
ENV SHIKSHA_COPILOT_BUILD=$SHIKSHA_COPILOT_BUILD

USER appuser

EXPOSE 5000

CMD ["sh", "-c", "python -m app.main --host 0.0.0.0 --port ${PORT:-5000}"]
