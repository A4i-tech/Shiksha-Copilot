FROM python:3.11.9-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

ENV PYTHON_ENV="staging" \
    MONGODB_URI="mongodb+srv://" \
    AZURE_OPENAI_API_KEY="" \
    AZURE_OPENAI_API_VERSION="2024-02-15-preview" \
    AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o" \
    AZURE_OPENAI_EMBED_MODEL="text-embedding-3-small" \
    AZURE_OPENAI_ENDPOINT="" \
    BING_API_KEY="your_bing_search_api_key_here" \
    BLOB_STORE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=dummyaccount;AccountKey=dummyaccountkey1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab==;EndpointSuffix=core.windows.net"

RUN apt-get update && apt-get install -y \
    curl build-essential git && \
    rm -rf /var/lib/apt/lists/*

RUN pip install poetry

WORKDIR /src/app-service

COPY . .

RUN poetry install --no-root --no-interaction --no-ansi

EXPOSE 5000

CMD ["sh", "-c", "poetry run python3 -m app.main --host 0.0.0.0 --port ${PORT:-5000}"]
