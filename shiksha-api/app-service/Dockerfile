FROM python:3.11.9-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1

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

RUN pip install poetry

RUN groupadd --gid 1000 appuser \
    && useradd --uid 1000 --gid appuser --create-home --shell /bin/bash appuser

WORKDIR /src

COPY components/rag-wrapper ./components/rag-wrapper
COPY shiksha-api/app-service ./shiksha-api/app-service

WORKDIR /src/shiksha-api/app-service

RUN poetry install --no-root --no-interaction --no-ansi

ARG SHIKSHA_COPILOT_BUILD
ENV SHIKSHA_COPILOT_BUILD=$SHIKSHA_COPILOT_BUILD

RUN chown -R appuser:appuser /src

USER appuser

EXPOSE 5000

CMD ["sh", "-c", "poetry run python -m app.main --host 0.0.0.0 --port ${PORT:-5000}"]
