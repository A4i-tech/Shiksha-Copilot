# Execution flow

Grep this file when a turn behaves oddly. Diagrams become out of date. The team updates
this file in the same commit as any routing change.

## One interactive turn

1. `POST /chat` -> `app/main.py::chat`. The body carries `message` and an optional
   `session_id`. **The body carries no scope field. This is by design.**
2. `app/identity.py::current_identity` converts a bearer token into `Identity(actor_id,
   scope_path)`. The chain is tenant / region / school / actor. Every downstream filter comes
   from this identity, never from the request body. `Identity.scope_at(level)` returns a
   prefix of this actor's own chain. This lets `remember(shared_with=...)` widen a fact
   without naming another actor's scope. The approval toolset gates widening past `school`.
3. `app/journey.py::run_turn`
   1. `app/guardrails.py::check_rate` checks a Mongo counter per actor per minute. Over the
      limit, it returns HTTP 429.
   1b. When a tool call on this session still waits on a person, `guardrails.has_pending
      (session_id)` returns HTTP 409. The parked history holds an unanswered tool call. No
      new prompt can be added until someone approves or denies it.
   2. The session ID defaults to `actor:YYYY-MM-DD`. A caller-supplied ID must belong to the
      caller: the episode `actor_id`, or the `actor_id:` prefix for a new one. Otherwise, the
      app returns 403. A session ID is an address, never a capability.
   3. `app/memory.py::load_episode` -> stored messages -> `ModelMessagesTypeAdapter.validate_python`.
   4. `app/journey.py::_agent_with_output_control` builds the agent and attaches the validator.
4. `app/agent.py::make_agent` is **the only model construction site in the codebase**.
   `_toolsets` gives the journey agent the platform registry. When `MCP_URL` is set, it also
   adds an `MCPToolset`. MCP tools are trusted-plane tools: same wrapper, same spans, same
   run-log events. The sandbox has no route to them.
   When `AZURE_OPENAI_ENDPOINT` is set, `_provider()` picks `AzureProvider`. Otherwise, it
   picks `OpenAIProvider(base_url, api_key)`. `FAKE_MODEL=1` substitutes `TestModel` here,
   and only here.
   It applies the model and provider from env, a `UsageLimits` budget, `retries=2`,
   `ModelSettings(timeout=...)`, the curated toolset, and the instructions hook.
5. The span `journey.turn` opens in `app/journey.py`. It carries `journey.session_id` and
   `journey.actor_id`.
6. Agent loop:
   - **before each request**: `hooks.instructions_for` injects `memory.retrieve(identity)`.
     It also stamps `journey.prompt.name` and `journey.prompt.version` on the span.
   - **before each step**: `hooks.prepare_tools` drops `publish_note` for a root-scope actor.
   - **one tool call**: `hooks.TimedToolset.call_tool` opens `tool.<name>`, times it, and
     converts an unexpected exception into `ModelRetry`. `ModelRetry`, `ApprovalRequired`,
     and `CallDeferred` pass through untouched. They are control flow, not failure.
   - **final output**: the validator in `journey._agent_with_output_control` calls
     `subagents.verify`. This is a cheap model with its own budget and a typed `Verdict`. It
     passes this run's tool calls plus a tail of the session as evidence. First rejection ->
     `ModelRetry`. Second rejection -> the app returns the ORIGINAL answer with
     `status: unverified`. A verifier flags problems. It never rewrites the answer. A
     verifier that rewrites could grind a correct answer into whatever passes its own check.
7. `memory.save_episode` writes the message list and the workspace key.
8. Return:
   - `status: ok` with the answer, or
   - `status: approval_required` (see below), or
   - `status: unverified` when the verifier subagent could not run at all (a provider
     without typed output). The app returns the answer and labels it unchecked, never as `ok`.
   - `status: degraded` when retries or the budget ran out. The app never returns a degraded
     turn as a success.

## Trust boundary — where it is crossed

Crossed only inside `tools.run_python` -> `app/sandbox.py::run_code`.

- **Out of the trusted plane:** a code string. Nothing else. No token, no connection
  string, no actor record.
- **Into the sandbox:** the container has `network_mode=none`, a read-only rootfs, an empty
  environment, and a tmpfs `/workspace`. The container restores this workspace from blob
  storage.
- **Back into the trusted plane:** stdout text only.
- **Every authenticated write** (`remember`, `publish_note`) happens in the trusted plane,
  under the scope that step 2 resolves. The sandbox never calls the platform API.

## Approval path

1. The model calls `publish_note`. `approval_required` raises before the tool body runs, so
   nothing is written.
2. The run ends with `DeferredToolRequests` as its output.
3. `guardrails.save_pending` stores the serialized message history plus the pending call ids
   in Mongo `approvals`.
4. `GET /approvals` lists what is waiting.
5. `POST /approvals/{session_id}` calls `journey.resume_with_approval`. This builds
   `DeferredToolResults` (`True`, or `ToolDenied(reason)`). It then re-enters `run_turn` at
   step 3.3 with that history. The tool body runs only on the approved branch.

## Sandbox lifecycle

- `main.lifespan` calls `sandbox.prefill`, which starts `warm_target()` containers per pool
  at boot. `crc32(actor) % SANDBOX_POOL_COUNT` places each actor in a pool. `journey.run_turn`
  calls `sandbox.capacity_check` before any work. It returns 503 when that pool is at its
  ceiling.
- A container starts with network access only when `SANDBOX_SETUP_CMD` is set. Setup runs,
  then `_revoke_network` disconnects every network for the life of the container.
- `sandbox._claim(session_id)` returns the bound container, or takes a warm one and restores
  `/workspace` from MinIO.
- After every exec, `sandbox._snapshot` tars `/workspace` back to MinIO. The sandbox is a
  cache. Mongo and MinIO hold the record.
- `sandbox.reaper` runs every 30 seconds. It removes a session idle past
  `SANDBOX_COOLDOWN_SECONDS`, or older than `SANDBOX_MAX_LIFETIME_SECONDS`. It then refills
  the warm list.
- **Rehydration:** if the container is gone (killed, host fault, expired cooldown), the next
  turn claims a fresh one and restores from the blob. Same session id, same workspace, new
  container. Nothing migrates.

## Scheduled path — where it joins

`app/scheduler.py::scheduled_session` (APScheduler, enabled by `SCHEDULE_ENABLED=1`)
resolves the `system` identity and calls `journey.run_turn`, the *same* function as step 3.
Only the trigger differs: no HTTP request, no rate check bypass, same memory writes, same
sandbox rehydration.

## Run log and console UI

Every turn writes a document to Mongo `runs`: `{session_id, actor_id, message, status,
events[]}`. Only two places append events: `app/journey.py::run_turn` (identity,
guardrails, episode, verifier, finish) and `app/hooks.py::TimedToolset.call_tool` (tool
called, returned, held for approval, failed). Each event names the node it belongs to. This
is what lights up the UI.

`GET /runs` returns the newest 25 runs. `app/static/ui.html` (served at `/ui`) polls
`/runs`, `/approvals`, `/memory`, and `/admin/pool` every 1.5 seconds. It maps `event.node`
onto the graph nodes. The node IDs in the UI match the `node` strings this file names. If
you change one, change both.

Run documents expire after 24 h via a TTL index, same rule as episodes.
