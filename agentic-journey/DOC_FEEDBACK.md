# Feedback for the agentic journey design doc

These findings came from building the primitives and running them against three model
providers. Each finding cost a bug, a wrong answer, or a leak before I understood it. None
came from reading alone.

The list order shows how much I think the doc should change.

---

## 1. A scope says *who*. It never says *when*. Memory needs both axes.

The doc gives hierarchical memory a scope chain and gives *episodic* memory a retention
policy. Hierarchical facts get neither an expiry nor a validity window.

This leaves shared, temporary state with no home: weather over a district, a school closure,
a power cut, a room swap for today. If the system stores it, the region still hears that it
is raining next March. If the system refuses to store it, which is what a "durability test"
in the prompt does, the platform cannot tell a teacher whether to plan an outdoor activity.

**Suggested change.** Add a validity window next to the scope. A fact becomes `(scope, key,
value, valid_from, valid_until)`. Retrieval must filter by the window and by the chain.
Temporal supersession already gives you `valid_from`. This window is its other half.

I implemented this as `remember(..., expires_in_hours=N)` with a Mongo TTL index. Verified
result: one teacher reported region-wide rain. Every teacher in that region acted on it. No
teacher outside the region acted on it. The fact carried a 24-hour shelf life that the model
chose itself.

---

## 2. The chain ends at the actor in the diagram, and nowhere else

Correction to an earlier version of this file. I first wrote that the chain has no per-actor
level. That was wrong. The scope diagram ends at `Actor`, below `Institution`.

The problem is that only the diagram says so. The prose defines a narrow scope as facts about
one actor, then every rule after it treats the institution as the leaf. I built the leaf as
the school and shipped the bug the diagram warns against. Every personal preference a teacher
stated went to school scope. Every colleague saw it.

**Suggested change.** State the leaf in the prose, not only in the picture. Add one rule: the
chain ends at a per-actor level, and a fact about a person is written there by default.

A related point needs a line of its own. **A shared summary republishes whatever it quotes.**
A school-scope note that summarizes a teacher's personal habit puts that habit at school
scope, in prose, no matter how careful the fact-level scoping was.

Second point on the same diagram. The chain shows six levels: Global, three Region levels,
Institution, and Actor. The doc also states that Cosmos DB hierarchical partition keys hold
three. Six levels do not fit. My four-level chain already does not fit. Finding 1 of the open
questions covers this, and the diagram makes it more urgent, not less.

---

## 2b. Episodic memory specifies four episode types. Only one is easy.

The episodic class diagram names `ActorEpisode`, `TaskEpisode`, `SessionEpisode` and
`SubagentEpisode`. The base `Episode` also carries `summary` and `continuationHook`.

The prose says only that a window exists per actor, per task, per session, and per subagent.
It does not say how the four relate, which one a retrieval reads first, or who writes the
summary and when.

I implemented one of the four: a session window keyed by session id. The other three and both
base fields are unbuilt. The subagent episode is the one I missed most. A verifier subagent
with its own episode would have carried its own prior context. Instead I hand-fed it a tail of
the parent session, which is finding 4 in this file.

**Suggested change.** For each of the four types, state its key, its lifetime, and its reader.
State whether `summary` is a rolling compaction of the window or a separate artifact. State
what a `continuationHook` runs and when.

---

## 3. An output guardrail needs bounded influence, not just a budget

The doc says to run a subagent over another agent's output. It lists budgets as the control.
Budgets bound *cost*. They do not bound *authority*.

I observed this twice, on two providers. The verifier rejected a correct answer that it
could not verify. The main agent rewrote the answer to satisfy the verifier. On the second
provider, the rewrite was **factually wrong**, and the verifier passed it. A guardrail that
can force a rewrite can turn a correct answer into whatever passes.

**Suggested change.** A verifier flags an answer. It does not rewrite the answer. Allow one
retry for a real defect. After that, the original answer stands, labeled unverified. Add
"unverified" as a first-class result next to the doc's "degraded".

---

## 4. A verifier without evidence is a random number generator with a confident voice

Three separate false rejections traced back to the same cause. The verifier saw the question
and the answer. It did not see the tool results or the earlier turns. Once the run log
truncated the tool output, the verifier did not see the whole tool output either. It called
true statements invented.

**Suggested change.** Specify the verifier's *inputs*, not just its existence. Give it the
tool calls of the turn, a tail of the session, and an explicit marker wherever evidence was
truncated. Also state the rule that follows from this: missing evidence is not a defect. Only
a contradiction is a defect.

---

## 5. "Route every model call through one abstraction" needs a companion rule for state

The one-call-path rule is right, and a grep in CI can easily enforce it. The doc does not
state an equivalent rule, and this gap cost a real bug: **one workspace takes one command at
a time.**

Models batch tool calls. On gpt-4.1, a `read_file` call returned `FileNotFoundError` for a
path whose `write_file` call had not yet returned. The read overtook its own write inside the
same sandbox. The doc does not suggest serializing execution per session. This problem stays
hidden until a provider that parallelizes tool calls exposes it.

**Suggested change.** Add this to the sandbox section: execution within one session runs in
serial order. Concurrency belongs between sessions, never inside one workspace.

---

## 6. A session identifier is an address, not a capability

The doc says to bind one sandbox to one actor and never share a session. It does not say who
is allowed to *name* a session.

Taking `session_id` from the request body is the obvious implementation, but it let any
authenticated actor attach to another actor's session. That actor then inherited the other
actor's episodic history and sandbox workspace. This is the same hole the doc already forbids
for scope filters, one field over.

**Suggested change.** Extend the existing rule. Derive **or verify** every scope-bearing
identifier against the authenticated identity. This covers session ids, workspace keys, and
blob paths.

---

## 7. Placement affinity must be a preference, not a cage

The doc gives the actor-to-pool mapping and the ceiling. Two things follow that the doc does
not state. Both broke a running fleet:

- **A hash must stay stable across restarts.** Python's `hash()` on a string is salted per
  process. Every actor remapped to a different pool on each boot. Use a fixed hash instead.
- **A full pool must spill over.** With a strict hash, a new pool does not help an actor
  whose hash still points at the full pool. New capacity must be reachable by the work that
  needs it.

**Suggested change.** State placement as three steps: try affinity first, then spill to the
emptiest pool with room, then refuse.

---

## 8. Scaling has two clocks, and the slow one is not enough

The doc says pool count is a scaling decision, and it describes retirement: stop placement,
let sessions drain, delete the pool. This is correct, and it works. A controller that can
rehydrate never migrates a live session.

The doc misses one point. A periodic controller pass cannot absorb a burst. With a 30-second
loop, an arrival spike returns 503 errors while new capacity is still minutes away.

**Suggested change.** Separate the two paths. Grow **on demand** at the moment a placement
would fail. Retire **on a timer**, slowly, once demand has drained. Scaling out is urgent.
Scaling in is never urgent.

---

## 9. Budgets sized for a chat turn silently truncate a task

The doc presents `request_limit` as a safety rail. It is also a *capability* setting. A
ten-step brief needs tens of model requests. A limit chosen for a conversational reply stops
the work halfway and returns a plausible partial answer.

**Suggested change.** State that the budget is sized per *workload*, not per platform. State
that exceeding it must be reported as an incomplete result, not as an answer. The doc's "fail
loudly" rule already implies the second point. The doc is missing the first point.

---

## 10. What "one call path" is worth, restated

Every finding above was cheap to fix because a single place existed to fix it. The doc argues
for this rule on guardrail grounds. The rule also deserves an argument on maintenance
grounds. A verifier's authority, a step budget, a provider swap, and a usage counter each
turned out to be one function.

---

## Smaller notes

- **Azure's `/openai/v1/` path is not the Azure API.** An endpoint that ends in `/openai/v1/`
  goes through a plain OpenAI-compatible provider. `AzureProvider` is for the classic
  deployment API, where the model name is a deployment name. Both exist in the same product.
  The doc should name the difference, because the wrong choice fails at the first call.
- **The framework moves.** `prepare_tools` moved from the agent to the toolset.
  `MCPServerStreamableHTTP` became `MCPToolset`. `result.usage()` became a property. The doc
  names specific pydantic-ai APIs. The doc should pin the version those names belong to.
- **Testing on a forgiving model hides the bugs that matter.** A provider that never
  parallelizes tool calls and never argues with a verifier gives a clean run. This clean run
  teaches nothing. Test the mechanism on a fake model. Test the behavior on the shipping
  model. Also test occasionally on a deliberately weak model. Two real bugs here came from
  the weak model.
- **`Reserved. Undefined.`** System methods stay undefined, so nothing here informs them.
  The team should decide whether they are a primitive or a naming placeholder before anyone
  builds against this section.
