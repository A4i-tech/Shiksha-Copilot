# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/python:4-python3.11-appservice

# 1) Base off the official Azure Functions Python 3.11 image
FROM mcr.microsoft.com/azure-functions/python:4-python3.11

# 2) Enable console logging for easier debug
ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

# 3) Install Poetry into the container
# pyproject.toml declares [tool.poetry.requires-plugins], a Poetry 2.x-only
# field, so 1.8.3 (the pin used elsewhere, e.g. app-service) rejects it outright.
RUN pip install --no-cache-dir poetry==2.5.1 poetry-plugin-export

# 4) Set the working directory where the Functions host expects your code
WORKDIR /home/site

# 5) Copy dependency manifests first (for Docker layer caching)
COPY shiksha-api/durable-functions/pyproject.toml shiksha-api/durable-functions/poetry.lock* ./wwwroot/

# 6) Copy the shared local path dependency so Poetry can find it
COPY components/rag-wrapper /home/components/rag-wrapper

WORKDIR /home/site/wwwroot

# 7) Configure Poetry to install into the system Python (not in a venv)
#    and install only non-dev (runtime) dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi

# 8) Copy the rest of your function-app code
COPY shiksha-api/durable-functions ./

# 9) Run as non-root: uid 1000 owns the code and the shared rag-wrapper source
RUN groupadd --gid 1000 appuser \
    && useradd --uid 1000 --gid appuser --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /home/site/wwwroot /home/components

USER appuser

# 10) The Functions base image already sets ENTRYPOINT/CMD to launch the host
