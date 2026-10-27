# Ingestion Pipelines

Data preprocessing logic that Shiksha Copilot uses to turn unstructured classroom content into structured data.

## Quick start

Install `omni-ingest` with `uv`, then run a pipeline on the target textbook file.

```bash
uv tool install omni-ingest
omni-ingest chapter.yaml --input textbook.pdf --output textbook.json
```

Write to stdout instead of a file:

```bash
omni-ingest chapter.yaml --input textbook.pdf --output -
```

Resume an interrupted run:

```bash
omni-ingest chapter.yaml --resume <pipeline_run_id> --output textbook.json
```

See [Available pipelines](#available-pipelines) for what each pipeline config does.

## Generate period plans

`period_plan.yaml` builds one payload for each chapter and topic group.
It accepts two inputs: a textbook PDF, or a learning-outcome xlsx workbook.
Both inputs end in the same chapter shape. The later steps are the same for both.
It then generates each lesson plan with the custom `section_graph` step.
The `section_graph` step runs the section dependency graph.
The `retrieve` settings nested inside `section_graph` read textbook passages from Qdrant. They are not a separate pipeline step.
`period_plan_runner.py` creates the connections and runs the pipeline.

Install the dependencies. Use Python 3.11 or later.

```bash
uv venv .venv
uv pip install --python .venv/bin/python omni-ingest==0.1.2 qdrant-client openai httpx aiohttp openpyxl pytest pyyaml langfuse==3.14.6
```

Set the environment variables.

| Variable | Use |
|----------|-----|
| `AZURE_OPENAI_API_BASE` | Azure OpenAI endpoint. |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI key. |
| `AZURE_OPENAI_API_VERSION` | Azure OpenAI API version. Required. Use `2023-12-01-preview` or newer, because JSON mode needs it. |
| `AZURE_OPENAI_MODEL` | Chat deployment name. The default is `GPT-4.1`. |
| `AZURE_OPENAI_EMBED_MODEL` | Embedding deployment name. The default is `text-embedding-ada-002`. |
| `QDRANT_URL` | Qdrant URL. The default is `http://localhost:6333`. |
| `QDRANT_API_KEY` | Qdrant key. |
| `WEBHOOK_URL` | Receiver for the PENDING, RUNNING, COMPLETED, and FAILED status posts. Leave it empty to skip the posts. |

The textbook steps of the pipeline also need the `omni-ingest` model settings.
See the omni-ingest documentation for these settings.

Run the pipeline on a learning-outcome workbook.
The workbook has one sheet per grade, named `6` or `Grade 6`.
Each sheet has the columns Chapter Number, Chapter Title, Period, Topic and Learning Outcomes.
Header case and spaces do not matter.
A blank chapter or period cell continues the value above it.
Give the grade and subject. They go into the Qdrant `index_path`.

```bash
.venv/bin/python period_plan_runner.py "Social LOs.xlsx" --workflow-template workflow.json --out period_plans --param grade=6 --param subject=social
```

The runner picks the input type from the file extension.
Use `--param medium=...` and `--param board=...` to change the defaults `english` and `BSE-TG`.
The `index_path` starts with the board name. Use `--param collection=...` to read a different Qdrant collection.

Run the pipeline on a textbook PDF.

```bash
.venv/bin/python period_plan_runner.py textbook.pdf --workflow-template workflow.json --out period_plans
```

Each finished plan is one JSON file in `--out`.
Run the command again to retry failures. The runner skips plans that already exist in `--out`.
The runner prints each failed plan and exits with code 1 if any plan failed.

Override a parameter of `period_plan.yaml` with `--param NAME=VALUE`.
For example, use `--param top_k=5` or `--param force_mode=gpt`.
Use `--concurrency` to generate several plans at the same time.

Qdrant retrieval uses top_k passages. The default is 10. It uses no score threshold.
The metadata filter comes from `chapter_info.index_path` of each plan.

Run the tests.

```bash
.venv/bin/python -m pytest tests
```

## Run as an HTTP service

`period_plan_server.py` replaces the old `shiksha-api/durable-functions` service.
The POST routes keep the paths of the old service, so the Shiksha backend needs no code change. The status, terminate and pipeline routes are new.

| Route | Behavior |
|-------|----------|
| `POST /api/v2/lesson-plans` | Validates the body and returns `202` with `instance_id` and `status_query_get_uri`. The run continues in the background and posts its statuses to `WEBHOOK_URL` under that `instance_id`. A bad body returns `400`. |
| `POST /api/v2/lesson-plans/checklist` | Needs `start_from_section_id`. Waits up to 200 seconds and returns the plan in the response. It posts no webhook status. A timeout returns `504`. |
| `GET /api/v2/lesson-plans/{instance_id}` | Returns `runtimeStatus` (`Running`, `Completed`, `Failed` or `Terminated`) and the output. The server keeps this state in memory only, so a restart clears it. |

### Run a flow on an uploaded file

Send a workbook (or a PDF) and name the flow in the URL. The service runs that yaml and returns the result.

| Route | Behavior |
|-------|----------|
| `GET /api/v2/pipelines` | Lists the flows (the `*.yaml` files in the image) and the parameters of each. |
| `POST /api/v2/pipelines/{flow}` | Multipart form. The field `file` is the input. The field `params` is a JSON object with the flow parameters, including `workflow_template` as an object. Returns `202` with `instance_id` and `status_query_get_uri`. |
| `GET /api/v2/pipelines/runs/{instance_id}` | Needs the `x-api-key` header. Returns `runtimeStatus` and `output`. `output.outputs` holds the pipeline metadata. For `period_plan` it has `payloads` and `lesson_plans`, and each finished plan is under `lesson_plans.<id>.plan`. `output.errors` lists every failure. |

The pipeline route is off until you set `PIPELINE_API_KEY`. Send the key in the `x-api-key` header.
An unknown flow returns `404`. An unknown parameter returns `400` and lists the valid ones.
A batch run posts no webhook status. Add `"webhook": true` to `params` to turn it on.

```bash
curl -H "x-api-key: $PIPELINE_API_KEY" -X POST http://localhost:8080/api/v2/pipelines/period_plan   -F "file=@Social LOs.xlsx" -F 'params={"grade": "6", "subject": "social", "workflow_template": {...}}'
```

Settings: `MAX_PIPELINE_RUNS` (default 2) limits how many pipeline runs go at the same time. `MAX_LESSON_PLAN_RUNS` (default 10) limits how many lesson plan runs go at the same time. `MAX_UPLOAD_MB` (default 25) limits the file size. `MAX_RETAINED_RUNS` (default 200) is how many finished runs the status route keeps. The oldest finished run is dropped first. `LOG_LEVEL` (default `INFO`) sets the log level.
A run may set `concurrency` up to 16 and `top_k` up to 50.
The service keeps run results in memory. Run one replica that does not scale to zero, and read the result before a restart.

Build and run the image. It reads the same environment variables as the runner.

Build from the repository root. The image includes `components/rag-wrapper` for blob-stored chapter indexes.

```bash
docker build -f ingestion/Dockerfile -t period-plan-server .
docker run -p 8080:8080 --env-file ingestion/.env period-plan-server
```

Set `LLM_WORKFLOW_URL` and `LLM_CHECKLIST_URL` on the backend to this service.

### Terminate a run

`POST /api/v2/lesson-plans/{instance_id}/terminate` and `POST /api/v2/pipelines/runs/{instance_id}/terminate` stop a running job.
Both need the `x-api-key` header, and both return `503` until `PIPELINE_API_KEY` is set. A terminated lesson plan posts a FAILED status with the text "The run was terminated.".
A run that already ended returns `409`.

### Chapter indexes

An `index_path` that contains `qdrant` is read from Qdrant. It must look like `qdrant/<collection>/<key>:<value>`.
Any other `index_path` is a legacy llama-index index in Azure Blob Storage, in the form `<container>/<path>`.
A path that contains `graph-index` loads as a property graph. Any other path loads as a vector index.
Set `BLOB_STORE_CONNECTION_STRING`, or `BLOB_STORE_URL` with Azure credentials, for these chapters.
The caller sets `index_path`, so the service reads only the containers that you list in `LEGACY_INDEX_CONTAINERS` (comma separated). Blob chapters fail with a clear error until you set it.
These chapters need more packages than the Qdrant path: `llama-index-core`, `llama-index-llms-azure-openai`, `llama-index-embeddings-azure-openai`, `azure-storage-blob`, `azure-identity`, `aiofiles` and `components/rag-wrapper`. The Dockerfile installs them.
Set `AZURE_OPENAI_BASE_MODEL` to the base model name, for example `gpt-4.1`. If you do not set it, the service uses the lowercase deployment name.
The service downloads the index on the first section and deletes it when the last plan that uses it ends.

### Tracing

Set `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` (and `LANGFUSE_HOST`) to send traces to Langfuse.
Each plan is one trace named `Shiksha-LP` with the user id and the tag `flow:lesson-plan`. Each section is a span named `section:<id>`.
Model calls appear under their section. Without the keys, or without the `langfuse` package, tracing does nothing.

## Available pipelines

| Pipeline | Description |
|----------|--------------|
| `chapter.yaml` | Processes a raw government textbook PDF into structured chapter metadata: table of contents, learning outcomes, and topic groups. |
| `period_plan.yaml` | Processes a raw government textbook PDF or a learning-outcome xlsx workbook. It builds one payload per chapter and topic group. It then generates the lesson plans. |
