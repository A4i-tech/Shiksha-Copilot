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
It then generates each lesson plan with the custom `section_graph` step.
The `section_graph` step runs the section dependency graph.
The `retrieve` settings nested inside `section_graph` read textbook passages from Qdrant. They are not a separate pipeline step.
`period_plan_runner.py` creates the connections and runs the pipeline.

Install the dependencies. Use Python 3.11 or later.

```bash
uv venv .venv
uv pip install --python .venv/bin/python omni-ingest qdrant-client openai httpx pytest pyyaml
```

Set the environment variables.

| Variable | Use |
|----------|-----|
| `AZURE_OPENAI_API_BASE` | Azure OpenAI endpoint. |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI key. |
| `AZURE_OPENAI_API_VERSION` | Azure OpenAI API version. The default is `2023-05-15`. |
| `AZURE_OPENAI_MODEL` | Chat deployment name. The default is `GPT-4.1`. |
| `AZURE_OPENAI_EMBED_MODEL` | Embedding deployment name. The default is `text-embedding-ada-002`. |
| `QDRANT_URL` | Qdrant URL. The default is `http://localhost:6333`. |
| `QDRANT_API_KEY` | Qdrant key. |
| `WEBHOOK_URL` | Receiver for the PENDING, RUNNING, COMPLETED, and FAILED status posts. Leave it empty to skip the posts. |

The textbook steps of the pipeline also need the `omni-ingest` model settings.
See the omni-ingest documentation for these settings.

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

## Available pipelines

| Pipeline | Description |
|----------|--------------|
| `chapter.yaml` | Processes a raw government textbook PDF into structured chapter metadata: table of contents, learning outcomes, and topic groups. |
| `period_plan.yaml` | Processes a raw government textbook PDF and builds one payload per chapter and topic group. It then generates the lesson plans. |
