## Prerequisites
1. Have docker installed, or have an account on Render → https://render.com/, or on Railway → https://railway.com/
2. GitHub access to Shiksha-Copilot repository (you can simply fork this repository)
3. Credentials to a MongoDB instance
4. An OpenAI API key
5. A Bing API key
6. Credentials for Azure Blob Store

While you can host the API service with just a Docker installation or a Railway account, you will be unable to access the `/chat/` endpoints.

## Deployment steps (Docker)
A Dockerfile is present in the repository's root directory.
1. Clone this repository.
1. Run `docker build -t shiksha-api-staging .` in the repository's root.
2. Configure environment variables in a `.env` file:
   ```env
   AZURE_OPENAI_API_KEY=sk-...
   AZURE_OPENAI_API_VERSION=2024-02-15-preview
   AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
   AZURE_OPENAI_EMBED_MODEL=text-embedding-3-small
   AZURE_OPENAI_ENDPOINT=https://...
   BING_API_KEY=
   BLOB_STORE_CONNECTION_STRING=
   MONGODB_URI=mongodb+srv://
   ```
3. Run the service:
   ```sh
   docker run -d --name shiksha-api \
       --env-file .env \
       -p 5000:5000 \
       shiksha-api-staging
   ```
4. Visit `http://localhost:5000/docs` to confirm Swagger UI loads.

## Deployment steps (Render)
1. Go to Render Dashboard and create a new workspace.
2. Select **New Web Service** and select the **Shiksha-Copilot** repository.
3. Configure environment variables (see above section for the list of vars).
4. Click **Deploy Web Service** and wait for successful build.
5. Visit the associated service domain `https://<your>.onrender.com/docs` to confirm Swagger UI loads.

## Deployment steps (Railway)
1. Go to Railway Dashboard → New → GitHub Repo, and select the **Shiksha-Copilot** repository.
2. Configure environment variables from the **Variables** tab (see above section for the list of vars).
3. Click **Deploy** to redeploy with the updated environment variables. Wait for successful build.
4. Go to **Networking** → **Public Networking** → **Generate Domain**, copy `https://<your>.up.railway.app`.
5. Visit `https://<your>.up.railway.app/docs` to confirm Swagger UI loads.

## Evaluate the service
Verify the service is running by visiting the `/health` endpoint or by executing `curl -s 'http://<your-url>/health' -H 'accept: application/json'`.
You should receive:
```json
{"status":"healthy","service":"Shiksha Copilot API"}
```

## Hosting an MCP server
Shiksha-Copilot runs an HTTP REST API server by default. Specify `TRANSPORT=mcp-http` to run an MCP server instead.
This will host an MCP server on the `/mcp` endpoint and make the REST API endpoints no longer accessible.
To test the MCP server, follow the steps:
1. Install and run MCP Inspector → https://github.com/modelcontextprotocol/inspector.
2. Set **Transport Type** to `Streamable HTTP` and **URL** to `http://localhost:8000/mcp?user_id=<uuid>`.  Replace `<uuid>` with a 36-character UUID hex string.
3. Click **Connect**.
4. Head over to **Tools** tab and click **List tools**. You will see a **shiksha-mcp** connector with 5 tools - General chat endpoint, Lesson-specific chat endpoint, Version, App name, and Health.
