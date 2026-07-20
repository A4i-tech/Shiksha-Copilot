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
   OPENAI_API_KEY=sk-...
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

## Setup Continuous Integration (CI)
CI is preconfigured in the repository and requires no extra setup. Code coverage is disabled by default unless the `COVERAGE_GIST_ID` repository variable and `COVERAGE_GIST_TOKEN` repository secret are configured.

To configure code coverage:
- Obtain a [personal access token](https://github.com/settings/personal-access-tokens) with "Read and write" permissison for "Gists". Configure this as a repository secret labelled `COVERAGE_GIST_TOKEN`
- Create a new gist via https://gist.github.com and copy the gist's ID. Configure this as a repository variable (_not secret!_) labelled `COVERAGE_GIST_ID`.
- Done! Any pushes to the default branch will update code coverage.

## Setup Continuous Deployment (CD) workflow
A `ci-render.yaml` in `.github/workflows` deploys passing builds automatically on Render. To setup:
1. Create a new **Web Service** from https://dashboard.render.com/
2. Under the **Existing Image** tab, type in the image URL. You can get this from the succeeding docker deploy workflow, under the **Sign the published Docker image** step in **build** job. (e.g., `ghcr.io/a4i-tech/shiksha-copilot`). Visit the link and copy your image URL (e.g., `docker pull ghcr.io/a4i-tech/shiksha-copilot:a4i-main`).
   > _Do **NOT** use the sha256-suffixed image URL as those are immutable and therefore won't update deployment with your repository's latest changes._
3. On Render, paste this image URL, then click **Connect**, then paste your environment variables in the next section.
4. Click **Deploy Web Service**. You should see the deployment logs.
5. Under the Render project's **Settings** tab, grab your **Service ID** (e.g., `srv-xxxxxxxxxxxxxxxxxxxx`). In your GitHub project's Settings, under **Secrets and variables** → **Actions**, paste this under **Repository secrets** with the name `RENDER_SERVICE_ID`.
6. From your Render account settings, under **API Keys**, create an API key and paste this in your repository secrets with the name `RENDER_API_KEY`.
7. You can test the workflow by heading to your GitHub project's Actions tab, then selecting **CI/CD** action and clicking **Run workflow** to test the workflow runs successfully.
8. Done. Pushes to the branch listed in `.github/workflows/main.yaml` should automatically trigger a deployment on Render.

As an optional step, configure a `MICROSOFT_TEAMS_WEBHOOK` to receive build status notifications on a Microsoft Teams channel:
1. In a channel where you want to be notified, select **Manage Channels**, then click **Edit** under **Connectors**:
2. Configure the **Incoming Webhook** connector
3. This step will generate a webhook URL. Paste this as a repository secret named `MICROSOFT_TEAMS_WEBHOOK`.
4. Done! Build status will be emitted to this channel at the end of workflow.
