FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends libmagic1 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home app
COPY components/rag-wrapper /tmp/rag-wrapper
COPY ingestion/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir uv \
    && uv pip install --system --no-cache -r /tmp/requirements.txt /tmp/rag-wrapper \
    "llama-index-core>=0.13" "llama-index-llms-azure-openai>=0.4" "llama-index-embeddings-azure-openai>=0.4" \
    azure-storage-blob azure-identity \
    && rm -rf /tmp/rag-wrapper

WORKDIR /app
COPY ingestion/*.py ingestion/*.yaml ./
USER app
ENV PORT=8080 \
    METADATA_STORE=sqlite+aiosqlite:///:memory:
EXPOSE 8080
CMD ["python", "period_plan_server.py"]
