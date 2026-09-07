# Tech stack

This doc shows what this implementation runs on. It also explains why each piece replaces
the matching Azure service. The versions here are what the running image installs, not what
the requirements file allows.

## Topology

Five containers run on one Docker network. The sandboxes are a sixth kind of container. The
app starts them on the host daemon. Compose does not declare them, because their lifetime is
a session, not a deployment.

```
                    ┌──────────── trusted plane ─────────────┐
  browser ── :8000 ─┤ app  FastAPI + pydantic-ai             │
                    │      pool controller, holds the key    │
                    └───┬────────┬────────┬────────┬─────────┘
                        │        │        │        │
             :27017 mongo   :9000 minio  :4317 jaeger  :9100 mcp
             facts        workspace      OTLP spans    class_roster
             episodes     tarballs                     curriculum_topics
             runs                                      term_dates
                        │
                        └── docker.sock ──> sandbox containers (untrusted)
                                            network=none, read-only rootfs,
                                            tmpfs /workspace, empty env
```

## Runtime

| Piece | Version | Role |
|---|---|---|
| Python | 3.12.14 | app and MCP server |
| pydantic-ai-slim | 2.40.0 | agent loop, hook points, toolsets, usage limits, MCP client |
| pydantic | 2.13.5 | typed tool args and typed subagent output |
| FastAPI | 0.141.1 | HTTP surface, dependency-injected identity |
| uvicorn | 0.52.4 | ASGI server |
| openai | 3.8.0 | provider SDK, used only through pydantic-ai |
| fastmcp | 4.0.3 | the MCP server, and the client transport underneath `MCPToolset` |
| httpx | 0.28.1 | transport for the MCP client |
| pymongo | 4.18.0 | memory, run log, rate counters |
| minio | 7.2.20 | workspace tarballs |
| docker (SDK) | 7.2.0 | the sandbox pool controller |
| apscheduler | 3.11.3 | timer-triggered sessions |
| opentelemetry-sdk | 1.44.0 | span export over OTLP/gRPC |
| pytest | 9.1.1 | the 17 mechanism tests |

## Services

| Service | Image | Stands in for | Why this one |
|---|---|---|---|
| `app` | built from `python:3.12-slim` | the platform service | holds credentials and actor scope. It is the only writer |
| `mongo` | `mongo:7` | Cosmos DB | prefix-indexed scope keys and a TTL index are all the memory primitive needs |
| `minio` | `minio/minio` | Blob Storage | S3 API, so the workspace code ports unchanged |
| `jaeger` | `jaegertracing/all-in-one:1.60` | Application Insights | ingests the same OTel GenAI spans. The backend is an env var |
| `mcp` | built from `python:3.12-slim` | a platform capability behind MCP | a service boundary the agent must cross, not an in-process call |
| sandboxes | `python:3.12-slim` | Container Apps dynamic sessions | run flags supply the isolation. There is no custom image to build or cache |

## Model provider

The app supports anything OpenAI-compatible, through one construction site
(`app/agent.py::make_agent`).

- Set `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and `MODEL_NAME` for OpenAI, Groq, OpenRouter,
  Together, DeepSeek, Mistral, Ollama, LM Studio, vLLM, and Azure's `/openai/v1/` compatible
  path.
- If you set `AZURE_OPENAI_ENDPOINT`, the app switches to `AzureProvider` for the classic
  Azure API. There, `MODEL_NAME` is a deployment name.
- `FAKE_MODEL=1` replaces the model with pydantic-ai's `TestModel`. It keeps real tools, a
  real sandbox, and real memory, with no provider and no cost.

The app currently points at the same endpoint and models as Shiksha Copilot's `app-service`:
`https://<resource>.openai.azure.com/openai/v1/`, `gpt-4.1`, with `gpt-5-nano` as
the cheap verifier tier.

## Deliberate omissions

This project has no ORM, no migration tool, no message broker, no Redis, no vector store, no
build step for the UI, no custom sandbox image, and no provider abstraction layer. The team
considered and skipped each one, because a smaller thing already worked: `pymongo` instead of
an ORM, a Mongo TTL index instead of a scheduler, an asyncio lock instead of a queue, React
from a CDN instead of a bundler, and one `if` instead of a provider registry. `DECISIONS.md`
records each choice with the cost to reverse it.

## Source map

| Path | Holds |
|---|---|
| `app/agent.py` | the one model call path, provider selection, budgets, tracing setup |
| `app/hooks.py` | every framework interception point, and nothing else |
| `app/journey.py` | one turn: identity, guardrails, memory, agent, verifier, run log |
| `app/memory.py` | hierarchical facts with scope prefixes, episodic window with TTL |
| `app/sandbox.py` | pools, placement, claim, cooldown, lifetime, snapshot, rehydrate |
| `app/tools.py` | the registry, per-agent subsets, the approval predicate |
| `app/identity.py` | the tenant/region/school/actor chain and the demo roster |
| `app/guardrails.py` | rate control, pending approvals |
| `app/subagents.py` | the verifier, its evidence, its bounded influence |
| `app/runs.py` | the run log the console reads |
| `app/static/ui.html` | the console: sign-in, node graph, runs, approvals, memory, pool |
| `mcp_server/server.py` | the MCP service |
| `scripts/user_test.py` | 56 non-mock checks in 10 groups |
| `scripts/reset.py` | clears all three stores |
| `scripts/load_test.py` | fleet elasticity: N agents, pools up and down, no model calls |

## Clearing state

```bash
python scripts/reset.py            # memory + workspaces + run log + sandboxes
python scripts/reset.py --memory   # Mongo only
```

Three stores hold state on different clocks. Clearing one store does not clear the whole
demo. Mongo holds facts and episodes. MinIO holds the tarballs a session restores from. The
sandbox containers hold the live tmpfs. `scripts/user_test.py` runs the same reset before
each test run.
