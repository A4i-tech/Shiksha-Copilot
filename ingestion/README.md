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
| `chapter_index.yaml` | Takes one chapter PDF. Reads each page with the OCR engine from `DEFAULT_OCR_ENGINE`, splits the text into chunks of at most `chunk_chars` characters, and embeds each chunk with `text-embedding-ada-002`. |

## Index a chapter

`chapter_index.yaml` does not name an OCR engine. The `DEFAULT_OCR_ENGINE` environment variable of `omni-ingest` chooses it. Set `DEFAULT_OCR_ENGINE=azure_mistral` for Telugu textbooks. Add `engine: <name>` to the `ocr` step to override the variable for one profile. Credentials come from the environment too, for example `MISTRAL_OCR_API_KEY`, `MISTRAL_OCR_ENDPOINT`, and `MISTRAL_OCR_MODEL`.

`chapter_index.yaml` writes no data by itself. Choose the Qdrant destination with `--output vector:default` and the `VECTOR_STORE__*` variables.
Shiksha reads the `text-dense` vector and LlamaIndex payload fields. Set `VECTOR_STORE__DENSE_VECTOR_NAME=text-dense` and `VECTOR_STORE__PAYLOAD_FORMAT=llama_index`. This needs an `omni-ingest` release that includes LlamaIndex payload support.

```bash
omni-ingest chapter_index.yaml --input chapter.pdf --output vector:default   --chapter-id "Medium=telugu,Grade=10,Subject=biology,Number=4" --chunk-chars 4000
```

`chunk_chars` limits characters, not tokens. Count tokens with the `text-embedding-ada-002` tokenizer before you write to Qdrant. Stop if a chunk exceeds 8191 tokens.
