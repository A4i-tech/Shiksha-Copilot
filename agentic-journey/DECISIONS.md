# Decisions

Append-only. Newest last. One entry per change: what, which library, why, what was
rejected, and what it costs to reverse.

## 2026-09-05 — target: local Docker, not Azure
Change: every Azure substrate in the design doc gets a local stand-in. The stand-in keeps
the *property* the doc relies on, not the vendor.
Why: the team must run and argue about the primitives before any Azure spend.
Mapping: Cosmos DB becomes MongoDB. AI Search security trimming becomes Mongo `$in` on a
scope-prefix key. ACA dynamic sessions become Docker containers held in a warm list. Blob
becomes MinIO. App Insights becomes Jaeger over OTLP. Durable Functions and timer become
APScheduler.
Cost if wrong: each store sits behind one module, so a swap is one file.

## 2026-09-05 — agent framework: pydantic-ai (installed 2.40)
Change: `app/agent.py::make_agent` is the only place that constructs a model.
Why: the doc's central rule. A second call path opts out of every guardrail, budget and
trace the first enforces. `tests/test_primitives.py::test_one_call_path` greps for a raw
client outside `agent.py` and fails the build if one appears.
Rejected: LangGraph (it brings a graph runtime the project does not need yet), raw OpenAI
SDK (it has no hook points, and hook points are the point of this design).
Note: v2.40 dropped the `prepare_tools=` Agent argument. It is now `toolset.prepared(fn)`.

## 2026-09-05 — hooks are bindings, not a layer
Change: `app/hooks.py` holds only framework extension points: `@agent.output_validator`,
`instructions`, `toolset.prepared`, a `WrapperToolset` subclass, `approval_required`,
`UsageLimits`.
Why: the framework already is the hook layer. A second one would only forward calls.
Cost if wrong: none. Removing a binding only removes one function.

## 2026-09-05 — traces: OTel SDK + Jaeger, `Agent.instrument_all()`
Library: opentelemetry-sdk + otlp-proto-grpc exporter.
Why: pydantic-ai already emits GenAI-convention spans. The backend is just an env var.
The same code reaches Application Insights on Azure by swapping the exporter.
Rejected: per-service manual spans (the doc's audit shows they drift into three different
styles).

## 2026-09-05 — memory: Mongo, scope stored as both list and prefix key
Change: `facts` carry `scope_path: [...]` and `scope_key: "org/south/school-12"`.
Retrieval filters on `scope_key ∈ {prefixes of the actor's scope}`, built server-side.
Why: Mongo matches an array only in full, so the string key is what an index can serve.
This is the early-binding property Azure AI Search gives with `search.in()`.
Rejected: `$graphLookup` (a chain this shallow does not need a graph), a vector store
(no retrieval-by-similarity requirement yet).

## 2026-09-05 — episodic store: a Mongo collection with a TTL index, no checkpointer
Library: pymongo, already required.
Why: the Azure answer is LangGraph's Cosmos checkpointer. Locally, that answer pulls in
LangGraph only for a message list plus an expiry. The TTL index is the retention policy
the doc demands at creation time.
Cost if wrong: one module (`memory.load_episode` / `save_episode`).

## 2026-09-05 — sandbox image: stock `python:3.12-slim`, no Dockerfile
Why: a custom image is a build step, a registry and a cache to invalidate, for a base
image plus nothing. The isolation comes from the run flags, not the image.
Add when: the agent needs libraries that `pip install` cannot reach (there is no egress).

## 2026-09-05 — sandbox isolation flags
Change: `network_mode="none"`, `read_only=True`, tmpfs `/workspace` and `/tmp`, `environment={}`,
512 MB, 128 pids.
Why: this makes the two-plane split real. No egress means the execution plane cannot call
the platform API even if the model authors code to try. Every authenticated write happens
in the trusted plane under the already-resolved scope.
Verified: `socket.create_connection` returns `Network is unreachable`. Writing to `/pwned`
returns `Read-only file system`. The sandbox has no platform env var.

## 2026-09-05 — workspace snapshot runs inside the sandbox
Change: `tarfile` over `exec` replaces `docker get_archive` / `put_archive`.
Why: two hard limits, both hit in testing. `get_archive("/workspace")` returns only the
mount point, because the contents live on a tmpfs. Docker refuses `put_archive` outright
on a container with a read-only rootfs. Keeping both flags is worth more than the
convenience, so Python produces and extracts the tar inside the container.
Cost if wrong: `_snapshot` / `_restore`, two functions in `app/sandbox.py`.

## 2026-09-05 — approval control uses the framework's deferred-tool protocol
Change: `toolset.approval_required(...)` gates `publish_note`. A gated call returns
`DeferredToolRequests`, and the system parks it in Mongo with the serialized message
history. The call resumes through `DeferredToolResults`.
Why: no new code. The framework ships the pause and the resume.
Bug this surfaced: the `WrapperToolset` wrapper caught `ApprovalRequired` and turned it
into a `ModelRetry`. The gate never fired, and the run died on retries instead. The code
now re-raises control-flow exceptions (`ModelRetry`, `ApprovalRequired`, `CallDeferred`)
untouched.

## 2026-09-05 — verification subagent sits in the output validator
Change: a cheap-model subagent with its own budget and typed verdict runs inside
`@agent.output_validator`. A rejection raises `ModelRetry`.
Why: the doc asks for a subagent that verifies the answer. The validator is the boundary
where the model can still fix a rejection.
Guard: when retries run out, the turn returns `status: "degraded"`, never a plausible
answer dressed as a success.

## 2026-09-05 — source mounted into the app container
Change: compose bind-mounts `./app`, `./prompts`, `./tests`.
Why: a rebuild per edit was the slowest part of getting this running.
Note: this is a dev convenience. Drop the mounts for anything shared.

## 2026-09-05 — run log in Mongo, UI polls it
Change: `app/runs.py` records one document per turn with an event list. Hooks and
`journey.run_turn` append to it. `GET /runs` serves it.
Library: pymongo again. Rejected: SSE or websockets. A live push needs a broker or
sticky in-process state, and it dies on restart. Also rejected: reading spans back out
of Jaeger, since its query API is for debugging, not a product surface.
Cost if wrong: one module plus one endpoint.

## 2026-09-05 — console UI is one static file, React from a CDN
Change: `app/static/ui.html` holds React 18 UMD plus Babel standalone. FastAPI serves it
at `/ui`.
Why: no build step, no node_modules, no second container, and it stays editable React.
The page is same-origin with the API, so no CORS layer either.
Rejected: a Vite app in its own compose service (a build pipeline for one page), htm/preact
(the request called for React).
Verified: the JSX compiles under Babel, and the component tree renders under
`react-dom/server` with a stubbed fetch. It produces 9 nodes, with states that come from a
sample run.
Cost if wrong: delete one file and one route.

## 2026-09-05 — FAKE_MODEL switch
Change: `FAKE_MODEL=1` makes `agent._model` return pydantic-ai's `TestModel`.
`subagents.verify` then short-circuits to a verdict marked `fake model: verification
skipped`. `FAKE_MODEL_TOOLS` picks which tools it calls.
Why: this lets the team exercise every primitive except the model itself, and demo it in
the UI, with no key and no spend. It also makes the turn tests hermetic.
Guard: the skipped verification says so in the run log rather than looking like a real
pass.

## 2026-09-05 — bring your own key: one provider branch, not a provider abstraction
Change: `agent._provider()` returns `AzureProvider` when `AZURE_OPENAI_ENDPOINT` is set and
`OpenAIProvider(base_url, api_key)` otherwise. `.env.example` carries a line per provider.
Why: every OpenAI-compatible endpoint already worked through the base-url provider. Azure
was the one real gap, because it needs an api-version and a deployment name rather than a
model name. One branch covers it.
Rejected: a provider registry or a plugin interface. One `if` beats a factory for two cases.

## 2026-09-05 — an unverified answer gets its own status
Change: when the verifier subagent itself fails, for example on a weaker endpoint with no
typed output, the turn returns `status: unverified` with the answer and the reason. It no
longer returns a 500.
`VERIFIER_ENABLED=0` skips it deliberately.
Why: the design forbids presenting a degraded result as a success, and the earlier code
turned a provider limitation into an unexplained server error. Three states now: `ok`
(checked), `unverified` (answered, unchecked, says so), `degraded` (gave up).

## 2026-09-05 — /config and /admin/model-check
Change: `/config` reports provider, endpoint, model, and whether a key is set. The system
never returns the key itself, only its last four characters when one is configured.
`/admin/model-check` makes one minimal real call through the same `make_agent` path.
Why: without it, the only way to test a key was a full turn. A 502 mid-turn does not say
whether the fault is the key, the base URL, or the model name.
Note: `docker compose restart` does not reload `.env`. `docker compose up -d app` does
reload it. This mistake cost two confused debugging rounds, so the guide now documents it.

## 2026-09-06 — verifier gets evidence, and a narrower remit
Change: `subagents.verify` now passes the run's own tool calls and results as evidence.
`prompts/verifier.md` (v3) tells the verifier to reject only a contradiction it can point
at. Missing evidence is explicitly not a defect.
Why: found on the first real model. The verifier saw only the question and the answer.
A true statement that rested on an earlier turn ("the number was 391") looked invented.
The verifier rejected a correct answer twice, and turned a good turn into `degraded`.
A verifier without evidence is a coin toss with a confident voice.
Evidence comes from the run log, which is already written, so this costs no extra call.
Cost if wrong: one function plus one prompt file.

## 2026-09-06 — a session awaiting approval refuses new turns
Change: `run_turn` raises 409 when the session has a pending approval and no decision came
with the request. The message names the endpoint and the payload.
Why: also found on the first real model. The parked message history holds an unanswered
tool call. Sending a fresh prompt made pydantic-ai raise `Cannot provide a new user prompt
when the message history contains unprocessed tool calls`. This reached the caller as a
bare 500. The rule is the point of an approval gate: the person decides before the loop
moves on.

## 2026-09-06 — a session id is not a capability
Change: `run_turn` rejects a caller-supplied `session_id` that is not the caller's own
(403). Ownership is the episode's recorded `actor_id`, and a new id must carry the actor
id as its prefix. Regression test: `test_a_session_id_is_not_a_capability`.
Why: an audit of the sandbox against the design doc found this. The doc says to bind one
sandbox to one actor, and never share a session. `session_id` came straight off the
request body. Any token could then name another actor's session, and get that actor's
episodic history and sandbox workspace. This is the same class of hole as accepting a
scope filter from the caller, which the code already refused to do.
Cost if wrong: one guard in one function.

## 2026-09-06 — the six sandbox gaps, closed
An audit of the doc against the code found each one.

1. **Kernel boundary.** The code passes `SANDBOX_RUNTIME` through to
   `containers.run(runtime=...)`. An empty value means the default docker runtime, a
   shared kernel. This is NOT what the doc asks for model-authored code. `runsc` (gVisor)
   or `kata` give a real boundary. `/admin/pool` reports `vm_boundary`, the UI shows a
   "shared kernel" badge, and the user test prints a warning. Infrastructure choice, not a
   code change: the code only has to allow and report it.
2. **Shell and file tools.** `run_shell`, `write_file`, `read_file` join `run_python`. All
   four execute inside the sandbox, so the trust boundary stays the same.
3. **Hard session lifetime.** `SANDBOX_MAX_LIFETIME_SECONDS` (default 3600) alongside the
   idle cooldown, the same pair Container Apps sessions impose. The reaper enforces both.
4. **Ceiling and placement.** `SANDBOX_MAX_CONCURRENT` per pool, `SANDBOX_POOL_COUNT`
   pools, and `crc32(actor) % pool_count` maps each actor to a pool. Over the ceiling, the
   system refuses the turn with 503 before any work starts. crc32, not `hash()`: Python
   salts str hashing per process, so `hash()` would remap every actor to a different pool
   on each restart.
5. **Little's Law.** The system measures start latency as an EWMA, and arrival rate over
   a 5-minute window. Depth = rate x latency + 1. The system always reports depth. It
   applies depth to the warm target only when `SANDBOX_AUTOSIZE=1`, and caps it at
   `SANDBOX_POOL_MAX`.
6. **Two-phase start.** `SANDBOX_SETUP_CMD` runs once on a bridge network, then the system
   disconnects every network for the life of the container. Verified: `pip install
   --target /workspace/libs requests` succeeds, and `has_egress` is then False. The
   library still imports, but an outbound request fails on DNS.

## 2026-09-06 — write_file refused to relocate a path
Change: a path outside `/workspace` now raises `ModelRetry` that names the writable area.
The tool no longer rewrites the path to `/workspace/<name>`.
Why: the boundary test asked the agent to create `/pwned`. The tool quietly wrote
`/workspace/pwned` instead, and the agent reported success. The sandbox was never
breached, but the answer said the opposite of the truth. This is the silent fallback the
design doc rules out.

## 2026-09-06 — truncated evidence is marked as truncated
Change: `runs.event` appends `...[truncated]` past 400 characters. The verifier prompt
(v4) now tells the verifier to expect an answer that carries more detail than the
truncated evidence.
Why: the verifier rejected a correct `env` dump three times, because truncation cut off
the evidence it read, mid-list. This is the second time evidence quality broke
verification. The lesson: a verifier needs to know the shape of what it cannot see.

## 2026-09-06 — scripts/user_test.py: non-mock user and boundary testing
Change: 27 checks in 7 groups drive the real API with the real model over HTTP. The
checks print run ids so a person can replay any check in the console UI. `--pace` delays
it so a person can watch live.
Why: the unit tests use a fake model and assert on internals. They cannot show whether a
real model actually refuses to leave the sandbox. Three failures on the first full run
came from the harness: a cp1252 console, a typographic hyphen, and a rate window that
outlived 24 serial calls. One failure was a real bug, the write_file issue above.

## 2026-09-06 — an MCP server, as a service, in the trusted plane
Change: `mcp_server/server.py` (FastMCP, streamable HTTP on :9100) exposes `class_roster`,
`curriculum_topics` and `term_dates`. `agent._toolsets` attaches `MCPToolset(MCP_URL)` to
the journey agent when `MCP_URL` is set.
Library: `pydantic-ai-slim[openai,mcp]` plus `fastmcp` and `httpx`. In pydantic-ai 2.40 the
class is `MCPToolset(client)`. The older `MCPServerStreamableHTTP` name is gone, and
pydantic-ai now accepts a plain URL as a client.
Why a service and not a stdio subprocess: the app already runs in a container. A compose
service makes the boundary from the design doc visible. It is a tool channel the trusted
plane calls out through, not something the sandbox can reach.
Placement: MCP tools run in the trusted plane. The same `TimedToolset` wraps them, so
they get the same spans, retries, and run-log events as platform tools. The sandbox still
has no route to them.
Lifecycle: `agent.run()` manages the MCP connection itself here. The code needs no
`async with agent`.

## 2026-09-06 — memory is inferred, not requested
Change: `prompts/journey.md` v4 tells the agent to store durable self-facts the moment the
actor states one in passing. It calls for one `remember` call per fact, with stable keys.
The prompt also spells out what is NOT durable: a question, a one-off number, or anything
task-local.
Why: the task test said "I teach grade 7 science, section A, planning term T3" and asked
only for a syllabus. The old prompt stored nothing. The agent answered later questions
from the episodic window, which is per-session and expires on the TTL. That looks like
memory and is not. After the change, the same sentence produced four facts: grade,
subject, section, term. The word "remember" never appeared anywhere.
Guard against the doc's own failure mode (instruction bleed): the prompt names the
durability test rather than saying "store everything interesting".

## 2026-09-06 — the task group: one job, every primitive
Change: `scripts/user_test.py --only task` runs a teacher's actual job across five turns.
The job infers a fact, pulls a syllabus over MCP, fetches a roster over MCP, and writes a
reusable script to the workspace. It runs the script, re-runs the saved script with a
different argument, writes a CSV, and proves the workspace survived the lot.
Why: the other groups each test one primitive. This one is the only check that the
primitives compose, which is the thing the design doc actually claims.
`tools_used(run_id)` reads the run log back, so a check can assert *which* tool ran, not
just that the answer looked right.

## 2026-09-06 — the scope chain gained an actor level
Change: `Identity.scope_path` now has four levels: tenant, region, school, actor.
`Identity.scope_at(level)` returns a prefix of the actor's own chain.
Why: with three levels the leaf was the school, so `remember` wrote every personal fact at
school scope. Every colleague could see a teacher's own habit. The doc's chain needs a
level that belongs to one person, or "narrow" has no floor.
Cost if wrong: the level names are one tuple in `identity.py`.

## 2026-09-06 — remember(shared_with=...), approved when it widens
Change: `remember` takes `shared_with`: `actor` (default), `school`, `region`, or `tenant`.
`scope_at` resolves the value, so a caller can widen along its own chain, and can never
name somebody else's. The approval toolset gates `region` and `tenant`.
Why: the doc asks for facts that a population shares, and separately for a gate on
high-consequence writes. A fact told to every school in a tenant is exactly that.
Mechanism: `ApprovalRequiredToolset` takes a predicate over the *validated arguments*, so
the same tool stays free at school scope, and the toolset gates it above that. No second
tool, no new code path.
Prompt v5 tells the agent which facts belong at which level, with the durability test
intact.

## 2026-09-06 — the step budget was sized for a chat, not a task
Change: `JOURNEY_REQUEST_LIMIT` (30) and `JOURNEY_TOOL_CALLS_LIMIT` (60), both env-tunable.
Why: the mega brief died 29 events in with "The next request would exceed the
request_limit of 8". The old numbers were fine for a reply and wrong for a ten-step job.
The doc's own guidance says limits differ per stage: a high one for the open-ended path, a
tight one for the bounded subagent. 8 was simply the wrong high one.
The failure was at least loud: `status: degraded` naming the limit and how to raise it.

## 2026-09-06 — scripts/mega_prompt.txt and the mega group
Change: one paste-able brief that a person cannot answer without touching every
primitive. It comes with `--only mega` to run it and `--show-mega` to print it for the UI
text box.
Verified in one turn: 9 `remember` calls at two scopes, all three MCP tools, `write_file`,
and many `run_python` and `run_shell` calls. The run built a real `/workspace/t3_plan.csv`
from actual syllabus topics and mixed-ability lab groups, and it passed the approval gate
for the note.

## 2026-09-06 — the suite has to start from an empty database
Change: `scripts/user_test.py` clears `facts`, `episodes`, and `approvals` before a run
(`--no-reset` keeps them). Every group that could inherit another group's leftovers now
asserts relatively: notes published *during* the group, keys gained versus keys withheld.
Why: the first full run scored 48/53 while every group passed alone. Facts left by an
earlier run made the agent skip the very tools under test. It already knew the syllabus,
so it never called MCP. It already knew the teacher, so it never called `remember`. The
suite measured its own residue.

## 2026-09-06 — four more harness bugs the full run exposed
None were defects in the system. All four were assumptions in the checks.
1. **A note check that read whole values.** A school-scope note quotes the personal habit
   it summarizes, so searching values for "first period" found it in arjun's copy. The
   fix compares *keys* instead: arjun gains the lab keys, but never gains
   `practical_period`, `grade`, `subject`, `section`. This is worth noting as a real
   property of the design: publishing a summary re-publishes whatever it quotes, at the
   summary's scope.
2. **One approval is not always enough.** A resumed run can reach the gate again. The
   script now drains pending approvals for the session, instead of deciding once.
3. **`publish_note` halts the run where the model called it**, so a later step in the
   brief may never have run. The follow-up now asks for the missing piece first, which is
   what a person would do.
4. **A spelling assumption.** The model stored `favorite_subject`. The check demanded
   `favourite_subject`. The key is the model's choice, so the check now asserts the fact.

## 2026-09-06 — provider throttling is not a test failure
Change: a 502 whose body names an upstream 429 backs off 30s, retries once, and prints
why.
Why: a full run makes 150+ model calls back to back and Ollama Cloud throttles partway.
The first full run recorded that as a mega-group failure, which is a lie about the
system.

## 2026-09-07 — pointed at the Shiksha Copilot Azure endpoint
Change: `.env` now uses the same endpoint and models as
`Shiksha-Copilot/shiksha-api/app-service`: `https://<resource>.openai.azure.com/openai/v1/`,
`MODEL_NAME=gpt-4.1`, and `gpt-5-nano` for the cheap verifier tier (their `pres_*` agents
use nano, and their chat paths use gpt-4.1). The team copied the key across without
reading it out loud.
Note: that endpoint is Azure's **OpenAI-compatible `/openai/v1/` path**, so it goes through
`OpenAIProvider(base_url=...)`, NOT `AZURE_OPENAI_ENDPOINT`/`AzureProvider`. Their
`.env.example` makes the same point. The OpenAI SDK reads `OPENAI_BASE_URL`, llama-index
reads `OPENAI_API_BASE`, and both must hold the same value.

## 2026-09-07 — a verifier may flag an answer, never rewrite it
Change: the first rejection still raises `ModelRetry`. A second rejection no longer does.
The system now returns the ORIGINAL answer with `status: unverified` and the verifier's
reason.
Why: on gpt-5-nano, the verifier rejected a correct answer twice ("391 is not supported by
the evidence"). The main agent then gave in and produced a WRONG answer ("no number was
computed"), which the verifier then approved. A guardrail that can force a rewrite can
grind a correct answer into whatever passes. Flagging is strictly safer than coercing.
Also: the verifier now sees a tail of the session (`_history`), so the verifier no longer
reads a claim that rests on an earlier turn as invented. That was the third time evidence
blindness caused a false rejection. The structural fix is the one that matters.
Lesson for the primitive: an output guardrail needs a bounded influence, not just a
budget.

## 2026-09-07 — one command at a time per workspace
Change: `sandbox.run_code` / `run_shell` take an asyncio lock keyed by session id.
Why: gpt-4.1 issues tool calls concurrently. `read_file` returned `FileNotFoundError` for
`/workspace/probe.txt` *before* the `write_file` that created it returned. A read
overtook its own write in the same sandbox. The container is one workspace, so it takes
one command at a time. The reaper drops the lock when it reaps the session.
This only appeared when the provider changed, which is the argument for testing on the
model you will actually ship.

## 2026-09-07 — a persona picker, because "who am I" is the whole demo
Change: `GET /actors` returns the demo roster (tokens are demo fixtures, no secrets), and
the UI opens on a sign-in screen grouped tenant → region → school → teacher. The top bar
shows the signed-in chain with a Switch button instead of a raw token box.
Why: the scope story is invisible when the actor is a string in a text field. Signing in
as priya, then as arjun, and watching the Memory tab change is the demonstration.
The picker filters out the 1-level service account. It rendered as `region · -`.

## 2026-09-07 — memory rows carry the level they came from
Change: `memory.retrieve_rows` returns each visible fact with its scope level. `GET
/memory/detail` exposes this. The Memory tab badges every row actor, school, region, or
tenant.
Why: "arjun sees the lab" is a claim. A row badged `school`, next to rows badged `region`
and `tenant`, with nothing badged `actor` from priya, is the evidence. Same retrieval
path, so the badge cannot disagree with what the agent actually receives.

## 2026-09-07 — the region level was declared but never exercised
Change: the `scopes` group gained a region leg. Priya records a region-wide safety
protocol, and it waits for approval. Then fatima (another school, same region) and arjun
(same school) inherit it, while neha (same tenant, other region) and omar (other tenant)
do not.
Why: the chain has four levels and the demo only proved three. `shared_with="region"` was
reachable and untested. There are 18 checks now, and all pass.

## 2026-09-07 — a decision must survive a failed resume
Change: `resume_with_approval` clears the pending row only after the resumed run actually
returns. Previously, it cleared the row first.
Why: a run that failed after the clear destroyed the person's approval, with nothing left
to retry. The fact silently never landed. A scopes run showed this: the check "after
approval it reaches another region" failed with an empty memory. The test now also
asserts the approve call's own response instead of discarding it.

## 2026-09-07 — a fact can have a shelf life
Change: `remember(..., expires_in_hours=N)` sets `valid_until`. Retrieval filters out
expired rows, and a Mongo TTL index on `valid_until` (`expireAfterSeconds=0`) deletes
them. Rows without the field never expire. `/memory/detail` reports `expires_at`, and the
prompt (v7) says which facts deserve a window.
Why: the team asked whether "it is raining here today" could be a region fact. The scope
mechanism already allowed it, but facts had no expiry, so it would still tell the south
region it was raining next March. The old prompt avoided the bug by refusing to store
volatile things at all. This left genuinely shared, genuinely temporary state, such as
weather, a closure, a power cut, or a room swap, with nowhere to live.
The design needs both: the query filter for correctness now (the TTL monitor runs about
once a minute), and the index so the row actually goes away.
Verified end to end: priya reported region-wide rain. The agent chose
`shared_with="region"` and `expires_in_hours=24` unprompted. The approval gate fired
because region is wider than a school. After approval, priya, arjun, and fatima all saw
it, while neha (other region) and omar (other tenant) saw nothing. Fatima's agent then
refused an outdoor activity for a reason nobody had told her.
Lesson for the primitive: a scope answers *who* may see a fact. It says nothing about
*when* the fact stops being true. Hierarchical memory needs both axes.

## 2026-09-07 — pools come and go with demand
Change: `SANDBOX_AUTOSCALE=1` adds a pool when utilization crosses `SANDBOX_SCALE_OUT_AT`
(0.75) and retires the emptiest one below `SANDBOX_SCALE_IN_AT` (0.25), newest first on a
tie. Retirement is the doc's own rule: stop placement, let the sessions expire or
rehydrate elsewhere, then delete the pool. Nothing ever migrates.
Two clocks, deliberately: growth happens **on demand** inside `capacity_check`, retirement
on the 30s controller tick. A periodic loop cannot absorb a burst. In the first load run,
the system returned 503s while it still needed 30 seconds to add capacity.
Two placement bugs fell out of it, both real:
- the system must find a live session by *lookup*, not by hashing. Otherwise, changing
  the pool count reroutes running work, the thing rehydration exists to avoid.
- affinity must spill. With a strict hash, adding a pool does not help an actor whose hash
  still points at the full one. So a full preferred pool now falls through to the
  emptiest pool with room.
Verified: 12 agents ramp one pool to four pools, then drain to one pool, with real
containers.

## 2026-09-07 — scripts/load_test.py: the fleet demo, deliberately separate
Change: a standalone harness that drives the pool controller directly with N synthetic
sessions and prints a timeline of sessions, pools, utilization and every scale event.
Why separate: it answers an infrastructure question, not a behavioral one, and putting it
in `user_test.py` would spend model calls to observe container scheduling. Zero model
calls.

## 2026-09-07 — the console shows the model and what it has cost
Change: `GET /usage` totals today's spend by model, straight from the run log. `POST
/admin/model` switches the journey model without a restart, and leaves the endpoint and
key untouched. The top bar carries a model dropdown and a live token counter that turns
amber past 200k.
Why: a demo that swaps models should also show which model answers, and what it costs,
while it runs.
Bug found while building this: `result.usage()` is a **property** in pydantic-ai 2.40, not
a method. The call raised an exception, the code silently caught it, and every run
recorded `{}`. The code now handles both, and records tool calls as well as tokens.

## 2026-09-07 — the console opens on the sign-in page, with model and fleet panels
Change: the console always lands on the sign-in screen. That screen carries two panels
besides the teacher roster. The model panel reads provider, model, endpoint, key state,
verifier and today's token spend from `GET /config` and `GET /usage`, and switches the model
through `POST /admin/model`. The fleet panel runs `POST /admin/simulate-load` and
`POST /admin/drain-load`, and draws each pool as a row of cells.
Why: the demo starts by choosing who you are. The model in use and the sandbox fleet are the
two facts a viewer needs before the first turn, and neither belongs to one actor.
Nothing on the page is hardcoded. Every value comes from the running service.
Bug this closed: `scripts/load_test.py` drives the pool controller in a separate process, so
the console showed nothing while it ran. The endpoints above drive the pools inside the
service, which is what the console reads.
Second bug: `simulate-load` changed `SANDBOX_MAX_CONCURRENT` and left it changed. `drain-load`
now restores the ceiling and the autoscale flag. A demo must not leave the service reconfigured.
Display: a pool that holds more sessions than a lowered ceiling reads `6/2 bound · over
ceiling`, and the cell row grows to fit. The controller applies a ceiling to new placement
only, so the count is correct and the label now says why.

## 2026-09-07 — sandbox containers carry readable names
Change: `_safe_name` gives each container a name like `sbx-load-3-demo-c987` or `sbx-warm-4d5d`.
Why: Docker Desktop and `docker ps` showed random names, so a viewer could not tell a sandbox
from anything else on the machine. A demo needs the fleet to be legible in the container list.
A container taken from the warm pool keeps its `sbx-warm-` name, because reuse is the point of
a warm pool. The console reports which sessions are bound.

## 2026-09-07 — a test run cleans up its own containers
Change: `scripts/user_test.py` removes every container labeled `role=agentic-sandbox` at the
end of a run.
Why: a run claims real containers. Without cleanup they stay until cooldown, and the next run
starts on top of the previous fleet.
