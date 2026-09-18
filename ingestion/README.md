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

## Available pipelines

| Pipeline | Description |
|----------|--------------|
| `chapter.yaml` | Processes a raw government textbook PDF into structured chapter metadata: table of contents, learning outcomes, and topic groups. |
| `lesson_resource.yaml` | Builds chapter-level lesson resources from a raw government textbook PDF: hands-on activity, real-world scenario, and question bank sections. |
