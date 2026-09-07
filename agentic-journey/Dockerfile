FROM python:3.12-slim
WORKDIR /srv
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
COPY prompts ./prompts
COPY tests ./tests
COPY mcp_server ./mcp_server
CMD ["uvicorn", "app.main:api", "--host", "0.0.0.0", "--port", "8000"]
