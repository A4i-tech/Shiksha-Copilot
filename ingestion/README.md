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

Build the payloads, then send them to the lesson-plan API. The runner needs only Python 3.

```bash
omni-ingest period_plan.yaml --input textbook.pdf --output payloads.json --workflow-template "$(cat workflow.json)"
python period_plan_runner.py payloads.json --url https://<host>/api/v2/lesson-plans --out period_plans
```

Run the runner again to retry failures. It skips plans that already exist in `--out`.

## Available pipelines

| Pipeline | Description |
|----------|--------------|
| `chapter.yaml` | Processes a raw government textbook PDF into structured chapter metadata: table of contents, learning outcomes, and topic groups. |
| `period_plan.yaml` | Processes a raw government textbook PDF and builds one period-plan API payload per chapter/topic-group. |
