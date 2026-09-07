# agentic-journey-local

This is a local, runnable reference implementation of the primitives in the "Agentic journey
design" doc. It swaps every Azure substrate for a Docker-local stand-in that keeps the
property the design needs. See `DECISIONS.md` for the reason for each swap. See `FLOW.md`
for the execution path.

## Run

```bash
cp .env.example .env      # set OPENAI_BASE_URL / OPENAI_API_KEY / MODEL_NAME
docker compose up -d --build
curl -s -H 'Authorization: Bearer demo' -H 'content-type: application/json' \
     -d '{"message":"remember that my term is T3, then compute 17*23 in the sandbox"}' \
     localhost:8000/chat
```

- Console UI: `localhost:8000/ui`, a node graph of the loop, live run feed, approval buttons
- API: `localhost:8000`, with `/chat`, `/approvals`, `/approvals/{session_id}`, `/memory`, `/admin/pool`
- Traces: `localhost:16686` (Jaeger)
- Blob console: `localhost:9001` (minioadmin / minioadmin)
- Tests: `docker compose exec app python -m pytest -q`
- Tech stack, topology and versions: `STACK.md`
- What building this suggests changing in the design doc: `DOC_FEEDBACK.md`
- Fleet elasticity demo: `python scripts/load_test.py --peak 12 --ceiling 4`
- Clear all demo state: `python scripts/reset.py`
- Full testing guide: `TESTING.md`. `FAKE_MODEL=1` runs the whole loop with no API key.
- Non-mock user + boundary test: `python scripts/user_test.py --pace 2` (watch it in the UI)
- The big one: `python scripts/user_test.py --show-mega` prints a brief to paste into the UI

Any OpenAI-compatible endpoint works. This includes OpenAI, Groq, OpenRouter, Together,
DeepSeek, Mistral, Ollama, LM Studio, and vLLM. Set `OPENAI_BASE_URL`, `OPENAI_API_KEY`, and
`MODEL_NAME`. `.env.example` has a ready line for each provider. Azure OpenAI uses
`AZURE_OPENAI_ENDPOINT` instead, and there `MODEL_NAME` becomes the deployment name.

Check a key before you spend a turn on it. Use `POST /admin/model-check`, or click the
**Check key** button in the UI. `GET /config` shows what the instance points at. It never
shows the key. `FAKE_MODEL=1` runs the whole loop with no provider at all.

After you edit `.env`, run `docker compose up -d app`. The `restart` command does not reload it.

## Primitive -> file

| Primitive | Where |
|---|---|
| One call path | `app/agent.py` (enforced by `tests/test_primitives.py::test_one_call_path`) |
| Hooks | `app/hooks.py`, instructions, prepared tools, tool wrapper. Validator in `app/journey.py` |
| Hierarchical + episodic memory | `app/memory.py` |
| Tool registry, curated subsets | `app/tools.py` |
| Sandbox, warm pool, rehydration | `app/sandbox.py` |
| Guardrails: rate, approval, failure | `app/guardrails.py`, budgets in `app/agent.py` |
| Sub-agent verification | `app/subagents.py` |
| Scheduling | `app/scheduler.py` (`SCHEDULE_ENABLED=1`) |
| Run log + console UI | `app/runs.py`, `app/static/ui.html` |
| MCP tool channel | `mcp_server/server.py`, attached in `app/agent.py::_toolsets` |

## Sandbox posture

| Control | Setting |
|---|---|
| Egress | none, ever (the setup phase is the only exception, and it is revoked) |
| Filesystem | read-only rootfs, tmpfs `/workspace` and `/tmp` |
| Credentials | empty environment |
| Kernel boundary | `SANDBOX_RUNTIME`. Empty means shared kernel. Set `runsc` or `kata` for a real one |
| Session limits | idle cooldown + hard max lifetime |
| Capacity | per-pool ceiling, actor mapped to a pool by crc32 |
| Sizing | Little's Law from measured start latency and arrival rate |

`GET /admin/pool` reports all of it, including `vm_boundary`.

## Not built

Vector retrieval, real auth, prompt-injection defenses, cost accounting, a code graph for
known step orders, step-level agent control (`agent.iter`). See the design doc's open
questions.
