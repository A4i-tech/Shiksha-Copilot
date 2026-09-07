# Testing guide

Everything below was run on this machine. Nothing here needs an API key except section 8.

> `pytest` wipes the `facts`, `episodes` and `approvals` collections. Re-seed after a test run.

## 0. Start

```bash
cd C:/Users/Punit/agentic-journey-local
cp .env.example .env          # first time only
docker compose up -d --build
docker compose ps             # app, mongo, minio, jaeger all Up
curl -s localhost:8000/healthz
```

With `FAKE_MODEL=1` in `.env`, the whole loop runs on pydantic-ai's `TestModel`. This mode uses
real tools, a real sandbox, and real memory, but no model provider and no cost. For section 8,
set `FAKE_MODEL=0` and add a real key.

| Surface | Where |
|---|---|
| Console UI | http://localhost:8000/ui |
| API | http://localhost:8000 |
| Traces | http://localhost:16686 |
| Blob console | http://localhost:9001 (minioadmin / minioadmin) |
| MCP server | http://localhost:9100/mcp (`class_roster`, `curriculum_topics`, `term_dates`) |

## 1. The suite

```bash
docker compose exec app python -m pytest -q      # expect: 14 passed
```

What each check defends:

| Test | Fails when |
|---|---|
| `test_one_call_path` | someone adds a second model client outside `app/agent.py` |
| `test_caller_cannot_supply_scope` | a `scope` field appears on the chat request body |
| `test_prompts_are_versioned` | a prompt loses its `version:` line |
| `test_newer_fact_supersedes` | temporal supersession breaks |
| `test_scope_isolation` | a sibling scope leaks |
| `test_promotion_moves_a_fact_up` | promotion stops moving a confident fact up the chain |
| `test_episodes_have_a_retention_policy` | the TTL index is dropped |
| `test_high_consequence_tool_waits_for_a_person` | the approval gate stops firing |
| `test_a_rejected_answer_is_never_returned_as_success` | a degraded answer is returned as `ok` |
| `test_a_session_id_is_not_a_capability` | one actor can attach to another actor's session |
| `test_pool_placement_is_stable_across_restarts` | a salted hash remaps actors to pools on restart |
| `test_sandbox_limits_are_enforced` | the cooldown or the hard lifetime cap stops working |

## 2. The console UI

Open http://localhost:8000/ui. The page opens on a **sign-in screen**. Pick a teacher from the
list, grouped by tenant, region, and school. The top bar then shows that teacher's full chain.
Use **Switch** to change persona. Type a message and press **Run turn**.

Try the two-teacher demo by hand. Sign in as **t-priya**. Say *"our school has a science lab
with 12 microscopes, free Tuesday afternoons"*. Press **Switch** and sign in as **t-arjun**.
Open the **Memory** tab. The lab facts appear there, badged `school`. None of priya's facts are
badged `actor`. Sign in as **t-fatima** (another school). The lab facts are gone.

- Nodes light up as the turn moves. The top row shows identity, guardrails, episode, and agent.
  The row below shows scoped facts, tools, and the sandbox. Each node shows one mark: active,
  done, waiting on a person, or failed.
- **Runs** expands the selected run into its event timeline, step by step.
- **Approvals** has the Approve / Deny buttons (section 5).
- **Memory** shows exactly what the current actor can see. Each row is one fact, badged with
  the level it came from: `actor`, `school`, `region`, or `tenant`. Switch persona, and the
  list changes with it.
- **Pool** shows warm sandboxes and bound sandboxes.

The UI polls every 1.5 s, so a browser window follows a run you started from curl.

## 3. Identity and scope

```bash
curl -s localhost:8000/memory                                   # 401 with a usable message
curl -s -H 'Authorization: Bearer nope' localhost:8000/memory   # 401, unknown token
```

Seed three facts at three scopes:

```bash
docker compose exec app python -c "
from app import memory
from app.identity import resolve
memory.init_indexes()
memory.write_fact(resolve('system'), 'term', 'T3')
memory.write_fact(resolve('demo'),   'favourite_subject', 'geometry')
memory.write_fact(resolve('other'),  'favourite_subject', 'history')
print('seeded')"

curl -s -H 'Authorization: Bearer demo'  localhost:8000/memory
curl -s -H 'Authorization: Bearer other' localhost:8000/memory
```

Verified result: `demo` sees `{"term":"T3","favourite_subject":"geometry"}`. `other` sees
`{"term":"T3","favourite_subject":"history"}`. The org-wide fact reaches both. Neither actor
sees the other's leaf-scope fact.

Try to widen your own scope. It is ignored, because the filter comes from the token:

```bash
curl -s -X POST localhost:8000/chat -H 'Authorization: Bearer other' \
  -H 'content-type: application/json' \
  -d '{"message":"hi","scope":["org"],"scope_path":["org"]}'
```

## 4. Rate control

```bash
for i in $(seq 1 22); do
  curl -s -o /dev/null -w "%{http_code} " -X POST localhost:8000/chat \
    -H 'Authorization: Bearer demo' -H 'content-type: application/json' -d '{"message":"x"}'
done; echo
```

Verified: 20 pass, then `429` carrying
`Rate limit reached: 20 requests per minute for this actor. Wait until HH:MM:SS UTC, or raise
RATE_LIMIT_PER_MINUTE in .env.` The cap fires before the model call, so it costs nothing.

## 5. Approval gate

Point the fake model at the gated tool, restart, run a turn:

```bash
sed -i 's/^FAKE_MODEL_TOOLS=.*/FAKE_MODEL_TOOLS=publish_note/' .env
docker compose up -d app && sleep 5

curl -s -X POST localhost:8000/chat -H 'Authorization: Bearer demo' \
  -H 'content-type: application/json' -d '{"message":"publish a note about term 3"}'
curl -s -H 'Authorization: Bearer demo' localhost:8000/approvals
curl -s -X POST "localhost:8000/approvals/actor-demo:$(date -u +%F)" \
  -H 'Authorization: Bearer demo' -H 'content-type: application/json' -d '{"approve":true}'
```

Verified: the first call returns `status: approval_required`, and the tool body never runs.
Before approving, check `/memory`. No `note:` key exists yet. After approval, the note appears
at the parent scope (`org/south`). `demo` sees it, and `other` does not.

Send `{"approve": false}` instead, and watch the denial reach the model. The Approvals tab in
the UI drives the same path.

Restore the default afterwards:

```bash
sed -i 's/^FAKE_MODEL_TOOLS=.*/FAKE_MODEL_TOOLS=recall,run_python/' .env && docker compose up -d app
```

## 6. Sandbox isolation and rehydration

```bash
docker compose exec app python -c "
import asyncio
from app import sandbox
async def main():
    await sandbox.prefill()
    print('egress :', await sandbox.run_code('probe', \"import socket\nsocket.create_connection(('1.1.1.1',80),2)\"))
    print('rootfs :', await sandbox.run_code('probe', \"open('/pwned','w')\"))
    print('creds  :', await sandbox.run_code('probe', \"import os;print([k for k in os.environ if 'KEY' in k or 'MONGO' in k])\"))
asyncio.run(main())"
```

Verified: `Network is unreachable`, `Read-only file system: '/pwned'`, and `['GPG_KEY']`.
`GPG_KEY` is the base image's own variable. It is not a platform credential.

Rehydration proves that a sandbox is a cache, not a record:

```bash
docker compose exec app python -c "
import asyncio
from app import sandbox
async def main():
    await sandbox.prefill()
    await sandbox.run_code('demo1', \"open('/workspace/note.txt','w').write('hello-durable')\")
    c = sandbox._bound['demo1']['c']; c.remove(force=True); print('killed', c.short_id)
    print('after rehydrate:', await sandbox.run_code('demo1', \"print(open('/workspace/note.txt').read())\"))
    print('new container  :', sandbox._bound['demo1']['c'].short_id)
asyncio.run(main())"
```

Verified: the file comes back inside a different container, under the same session id.

Watch the pool directly:

```bash
docker ps --filter label=role=agentic-sandbox --format '{{.Names}} {{.Status}}'
curl -s -H 'Authorization: Bearer demo' localhost:8000/admin/pool
```

For cooldown, set `SANDBOX_COOLDOWN_SECONDS=60` and restart the app. Run a turn, then wait
about 90 s. Watch the bound container leave `docker ps` while the warm count refills.

## 7. Traces

Run a turn. Then open http://localhost:16686 and pick service `agentic-journey`.

```bash
curl -s 'localhost:16686/api/traces?service=agentic-journey&limit=1' \
 | python -c "import json,sys;d=json.load(sys.stdin)['data'][0];[print(s['operationName'],{t['key']:t['value'] for t in s['tags'] if t['key'].startswith('journey')}) for s in d['spans']]"
```

Verified: the trace shows `journey.turn`, `invoke_agent`, `chat <model>`, and `tool.<name>`
spans. Each span carries `journey.session_id`, `journey.actor_id`, and `journey.prompt.version`.
Edit `prompts/journey.md` and raise its `version:` line. Run the turn again. The new version
shows on the span.

## 8. With a real key

Any OpenAI-compatible endpoint works. Set three values in `.env`. Nothing else changes.
`.env.example` carries ready-made lines for OpenAI, Groq, OpenRouter, Together, DeepSeek,
Mistral, Ollama, LM Studio, and vLLM.

```bash
OPENAI_BASE_URL=https://api.groq.com/openai/v1   # your provider
OPENAI_API_KEY=gsk_...
MODEL_NAME=llama-3.3-70b-versatile
FAKE_MODEL=0
```

Azure OpenAI is the exception. It needs its own endpoint and api-version. `MODEL_NAME` becomes
your *deployment* name:

```bash
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com
AZURE_OPENAI_API_VERSION=2024-10-21
OPENAI_API_KEY=<azure key>
MODEL_NAME=<deployment name>
```

Apply and check the key before spending a turn on it:

```bash
docker compose up -d app && sleep 5      # `restart` does NOT reload .env — use `up -d`
curl -s -H 'Authorization: Bearer demo' localhost:8000/config
curl -s -X POST -H 'Authorization: Bearer demo' localhost:8000/admin/model-check
```

`/config` shows the provider, endpoint, model, and whether a key is set. It never shows the key
itself. `/admin/model-check` makes one small real call. It returns
`{"ok":true,...,"reply":"ready"}`, or a 502 that names the fault and the fix. The **Check key**
button in the UI top bar does the same check.

Then run a normal turn:

```bash
curl -s -X POST localhost:8000/chat -H 'Authorization: Bearer demo' -H 'content-type: application/json' \
  -d '{"message":"remember that my term is T3, then compute 17*23 in the sandbox and tell me both"}'
```

Provider problems, all visible in the run log:

| Symptom | Cause | Fix |
|---|---|---|
| answers but never calls a tool | the model has no native function calling | pick a tool-capable model |
| `status: unverified` | the endpoint could not run the typed-output verifier | set `VERIFIER_MODEL_NAME` to a capable model, or `VERIFIER_ENABLED=0` to accept unchecked answers |
| connection refused to a local provider | `localhost` from inside the container | use `host.docker.internal` |
| 502 on the first turn | key, endpoint or model name | run `/admin/model-check` and read `next` |
| 409 on a new turn | that session has a tool call waiting on a person | approve or deny it first, then continue |

`status: unverified` returns the answer *and* says it is unchecked. It is never reported as
`ok`.

Verified on Ollama Cloud (`https://ollama.com/v1`, `gpt-oss:120b`): `remember` stored the fact.
`run_python` executed `17*23` in the sandbox and returned 391. The verifier passed the answer.
A second turn recalled both facts across the episodic window. `publish_note` was held for
approval with real arguments before it wrote to the parent scope.

Worth trying:

- Ask something in one turn, then refer back to it in the next turn. This tests episodic
  memory.
- Ask "what do you know about me". Scoped facts arrive through the instructions hook.
- Write a CSV of the 12 times table to /workspace/times.csv, then read it back. The file
  survives the turn, and MinIO holds the tarball.
- Publish a note that says term 3 starts Monday. The approval gate fires.
- A wrong key returns HTTP 502 that names the fault and the fix, not a stack trace.

## 9. Break it on purpose

| Change | Expected |
|---|---|
| add `from openai import AsyncOpenAI; AsyncOpenAI()` to `app/tools.py` | `test_one_call_path` fails and names the file |
| add `scope: list[str]` to `ChatIn` in `app/main.py` | `test_caller_cannot_supply_scope` fails |
| delete the `version:` line from `prompts/journey.md` | `test_prompts_are_versioned` fails |
| remove `publish_note` from `tools.APPROVAL_REQUIRED` | the approval test fails, and the write lands with no person in the loop |
| drop the TTL index: `docker compose exec mongo mongosh journey --eval 'db.episodes.dropIndex("updated_at_1")'` | the retention test fails |

## 10. The non-mock user test

The unit suite uses a fake model and checks internal values. This suite drives the real API
with the real model over HTTP, exactly as a person would. It prints run ids, so you can
replay any check in the console.

```bash
python scripts/user_test.py                 # all 7 groups, 27 checks
python scripts/user_test.py --only boundary # one group
python scripts/user_test.py --pace 3        # slow enough to watch in the UI
python scripts/user_test.py --list
python scripts/user_test.py --no-reset       # keep whatever is already in the database
```

By design, the suite **clears the database first**. Facts left by an earlier run make the
agent skip the tools under test. The agent already knows the syllabus, so it never calls MCP.
Use `--no-reset` only when you want to test on top of existing state.

A full back-to-back run makes over 150 model calls, so a hosted provider may throttle partway
through. A 502 that names an upstream 429 backs off, retries once, and reports this.

Open http://localhost:8000/ui beside it. Nodes light up for each turn, and each check appears
in the Runs tab. The exit code is 0 only when every check passes.

| Group | What it proves |
|---|---|
| `smoke` | the stack is up, the key works, the pool is warm, and it warns when there is no VM boundary |
| `journey` | remembers a fact, computes in the sandbox, recalls across turns, writes and reads a file, uses the shell |
| `boundary` | no egress, read-only rootfs, no credentials inside, cannot reach the platform API |
| `approval` | the write pauses, nothing lands early, a new turn is refused until decided, approval resumes it, the note stays in scope |
| `isolation` | unknown token refused, foreign session refused, caller-supplied scope ignored |
| `limits` | the rate limit refuses a concurrent flood, and the pool reports its ceiling and sizing |
| `task` | one real job: infer a fact, two MCP calls, write a script, run it, re-run it, produce a CSV |
| `scopes` | four teachers: what one shares, exactly who inherits it, and who never does |
| `mega` | one large brief that must touch every primitive to be answerable |
| `recovery` | kills every sandbox container, then proves the workspace returns |

Verified run against Ollama Cloud (`gpt-oss:120b`): **35 passed, 0 failed**.

The `task` group is the one worth watching. Five turns, no mocks:

1. *"I teach grade 7 science, section A, and I am planning term T3. What topics are on my
   syllabus?"* The syllabus comes from the MCP server. The test stores four facts (grade,
   subject, section, term) without ever using the word "remember".
2. Fetch the class roster over MCP. Write `/workspace/at_risk.py` with a reusable
   `at_risk(students, min_attendance)` function. Run it at 0.8.
3. Re-run the **saved** script at 0.9 without rewriting it. A different list comes back.
4. Write the result to `/workspace/at_risk.csv`. Recall which subject the teacher takes.
5. Run `ls /workspace`. Both files are still there.

That single group exercises MCP, code writing, code execution, code reuse across turns,
workspace persistence, and inferred memory together.

Note on `limits`: the test fires the burst from 24 threads on purpose. Twenty-four *serial*
turns take longer than the one-minute window they must fill. For that reason, the limit never
trips.

## 10a. Memory scopes: four teachers, one chain

The chain is **tenant / region / school / actor**. `remember(key, value, shared_with=...)`
picks the level, always inside the caller's own chain. Widening past a school waits for a
person's approval.

| Token | Chain |
|---|---|
| `priya` | a4i / south / school-12 / t-priya |
| `arjun` | a4i / south / school-12 / t-arjun |
| `fatima` | a4i / south / school-07 / t-fatima |
| `neha` | a4i / north / school-21 / t-neha |
| `omar` | **nova** / west / school-31 / t-omar |

```bash
python scripts/user_test.py --only scopes --pace 3
```

Priya says, without being asked to store anything:

> Our school has a science lab with 12 working microscopes, and it is free on Tuesday
> afternoons. I personally always run practicals in the first period.

The agent files the lab at **school** scope and the habit at **actor** scope. Then:

```bash
for t in priya arjun fatima neha omar; do printf "%-7s " $t;   curl -s -H "Authorization: Bearer $t" localhost:8000/memory; echo; done
```

Verified output:

```
priya   {"microscopes":"12","lab_free_time":"Tuesday afternoons","practice_period":"first period","science_fair_date":"2027-02-14"}
arjun   {"microscopes":"12","lab_free_time":"Tuesday afternoons","science_fair_date":"2027-02-14"}
fatima  {"science_fair_date":"2027-02-14"}
neha    {"science_fair_date":"2027-02-14"}
omar    {}
```

- **arjun** (same school) already knows about the lab. He can book it in his first turn
  without being told. He does *not* get Priya's personal habit.
- **fatima** (same region, other school) does not see the lab at all.
- **neha** (same tenant, other region) sees only the tenant-wide fact.
- **omar** (different tenant) sees nothing, ever.
- `science_fair_date` reached everyone in a4i only because a person approved it. A request for
  a tenant-wide fact first returns `status: approval_required`. Nothing is stored until the
  approval lands.

## 10a-ii. Volatile shared state

A scope says who may see a fact. It says nothing about when the fact stops being true. So
`remember` also takes `expires_in_hours`.

```bash
curl -s -X POST localhost:8000/chat -H 'Authorization: Bearer priya'   -H 'content-type: application/json'   -d '{"message":"Heads up, it is raining heavily across the whole south region today, so outdoor activities are off. Everyone in the district should know.","session_id":"t-priya:rain-1"}'
curl -s -X POST localhost:8000/approvals/t-priya:rain-1 -H 'Authorization: Bearer priya'   -H 'content-type: application/json' -d '{"approve":true}'

for t in priya arjun fatima neha omar; do printf "%-7s " $t;   curl -s -H "Authorization: Bearer $t" localhost:8000/memory/detail; echo; done
```

Verified: the agent chose `shared_with="region"` and `expires_in_hours=24` on its own. The
approval gate fired because region is wider than a school. Afterward, priya, arjun, and fatima
carried `region:rain_south` with an expiry timestamp. neha (other region) and omar (other
tenant) had nothing. Asked whether to plan an outdoor activity, fatima's agent said no and gave
the rain as the reason. Nobody had told her this fact directly.

The system filters the row at query time and deletes it with a Mongo TTL index on
`valid_until`. A fact stored without a window never expires.

## 10b. The mega brief

```bash
python scripts/user_test.py --show-mega        # print it, to paste into the UI text box
python scripts/user_test.py --only mega --pace 0
```

One message, ten numbered steps: two MCP lookups, a roster, a reusable script with a self
check, a run of the script, a second call with different arguments, a computed session count,
a generated CSV, a shell listing, a published note, and a summary of what the agent now knows.

Verified in a single turn: 9 `remember` calls across two scopes, `curriculum_topics`,
`term_dates`, `class_roster`, `write_file`, repeated `run_python` and `run_shell`, the
approval gate for the note, and a real `/workspace/t3_plan.csv`:

```
week,date,topic,group
1,2027-01-05,Nutrition in plants,Diya;Meera;Ishaan
2,2027-01-12,Heat,Sara;Aarav;Rohan
```

If this returns `status: degraded` naming a `request_limit`, raise `JOURNEY_REQUEST_LIMIT`
in `.env`. A ten-step brief needs tens of model requests, not the handful a chat reply uses.

## 11. Sandbox posture

```bash
curl -s -H 'Authorization: Bearer demo' localhost:8000/admin/pool
```

| Field | Means |
|---|---|
| `runtime`, `vm_boundary` | the container runtime, and whether it puts a kernel between the sandbox and the host |
| `pool_count`, `max_concurrent_per_pool` | how many pools, and the session ceiling in each |
| `start_latency_ms`, `arrival_rate_per_min`, `littles_law_depth` | measured inputs and the depth they imply |
| `warm_target`, `autosize` | what prefill aims for, and whether Little's Law drives it |
| `cooldown_seconds`, `max_lifetime_seconds` | idle expiry and the hard cap |
| `setup_phase` | whether a networked setup command runs before egress is revoked |

**No VM boundary by default.** The default docker runtime shares the host kernel. The design
doc asks for a real boundary around model-authored code. For a real boundary, install gVisor.
Add `{"runtimes":{"runsc":{"path":"/usr/local/bin/runsc"}}}` to `/etc/docker/daemon.json`.
Restart docker, then set `SANDBOX_RUNTIME=runsc`. Until you do this, the UI shows a
"shared kernel" badge, and the user test prints a warning.

Exercise the ceiling and the placement rule:

```bash
sed -i 's/^SANDBOX_MAX_CONCURRENT=.*/SANDBOX_MAX_CONCURRENT=1/' .env && docker compose up -d app
# two different sessions for the same actor -> the second is refused with 503
```

Exercise the two-phase start (network during setup, none afterwards):

```bash
sed -i 's|^SANDBOX_SETUP_CMD=.*|SANDBOX_SETUP_CMD=pip install --quiet --target /workspace/libs requests|' .env
docker compose up -d app && sleep 20
docker compose exec app python -c "
import asyncio
from app import sandbox
async def main():
    c = sandbox._start_container()
    print('egress after setup:', sandbox.has_egress(c))
    sandbox._pools[0].bound['actor-demo:setup'] = sandbox.Entry(c, 0, 0)
    print('installed lib works:', await sandbox.run_code('actor-demo:setup', 'import requests;print(requests.__version__)'))
    c.remove(force=True)
asyncio.run(main())"
```

Verified: `egress after setup: False`. `requests 2.34.2` still imports from
`/workspace/libs`. An outbound call still fails on DNS.

## 12. Reset and stop

```bash
docker compose exec mongo mongosh journey --eval 'db.dropDatabase()'   # clear memory
docker compose down          # stop, keep volumes
docker compose down -v       # stop and wipe mongo + minio data
docker ps --filter label=role=agentic-sandbox -q | xargs -r docker rm -f   # stray sandboxes
```
