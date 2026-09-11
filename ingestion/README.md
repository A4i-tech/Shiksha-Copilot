# Ingestion Pipelines

Operational data ingestion pipelines for Shiksha Copilot using [`omni-ingest`](https://github.com/A4i-tech/OmniIngest).

Ingestion tasks are operational batch processes decoupled from the `shiksha-api` (`app-service`) runtime.

---

## 1. Installation

Install `omni-ingest` as a standalone CLI tool via `uv`:

```bash
# Install via uv tool from package or git repository
uv tool install git+https://github.com/A4i-tech/OmniIngest.git

# Or install from local path during development
uv tool install /path/to/OmniIngest --force
```

Verify the installation:

```bash
omni-ingest --help
```

Alternatively, execute ad-hoc without permanent installation:

```bash
uv tool run --from git+https://github.com/A4i-tech/OmniIngest.git omni-ingest --help
```

---

## 2. Profiles

### `chapter.yaml`

Textbook chapter ingestion pipeline for raw curriculum PDFs (NCERT, KSEEB, BSE-TG).

**Execution steps:**
1. **`page_chunking`**: Splits input PDF into individual pages.
2. **`extract` (metadata)**: Scans initial pages (1–16) for curriculum metadata (`board`, `medium`, `grade`, `subject`, `subject_norm`).
3. **`extract` (TOC)**: Scans table-of-contents pages (8–12), parses sequential chapter numbers, names, and starting/ending pages.
4. **`extract` (Chapter 1 offset)**: Locates physical page index where Chapter 1 starts to calculate page offset.
5. **`page_stitching`**: Reassembles individual chapter PDF documents using calculated offsets and TOC page boundaries.
6. **`extract` (chapter content)**: Extracts structured topics, subsection numbering, learning outcomes, and period-wise teaching topic groups.
7. **`transform`**: Builds unified Shiksha schema JSON (`_id`, `chapter_number`, `chapter_title`, `topics`, `topic_groups`, `index_path`).

---

## 3. Usage

Run chapter ingestion on a textbook PDF:

```bash
omni-ingest ingestion/chapter.yaml \
  --input path/to/textbook.pdf \
  --output path/to/output.json
```

Output to stdout:

```bash
omni-ingest ingestion/chapter.yaml \
  --input path/to/textbook.pdf \
  --output -
```

Resume an interrupted pipeline execution:

```bash
omni-ingest ingestion/chapter.yaml \
  --resume <pipeline_run_id> \
  --output path/to/output.json
```
