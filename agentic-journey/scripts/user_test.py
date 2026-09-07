"""Non-mock user and boundary test. Drives the real API with the real model.

    python scripts/user_test.py                 # everything
    python scripts/user_test.py --only boundary # one group
    python scripts/user_test.py --pace 4        # slow down so the UI is watchable
    python scripts/user_test.py --list

Every check goes through HTTP exactly as a person would, so the console at
http://localhost:8000/ui shows each turn as it happens. Run ids are printed, so a
failure can be opened in the Runs tab.

Exit code 0 when every check passes, 1 otherwise.
"""
from __future__ import annotations

import argparse
import json
import pathlib
import sys
import time
import urllib.error
import urllib.request
from datetime import date

BASE = "http://localhost:8000"
# a model answer may contain any unicode; a cp1252 console must not kill the run
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
GREEN, RED, DIM, YELLOW, BOLD, OFF = "\033[32m", "\033[31m", "\033[2m", "\033[33m", "\033[1m", "\033[0m"

results: list[tuple[str, str, str]] = []   # group, name, "pass" | "fail" | "skip"
PACE = 1.0


def api(method: str, path: str, token: str = "demo", body: dict | None = None,
        timeout: int = 240, _retry: bool = True):
    """Returns (status, parsed_json). Never raises on an HTTP error status.

    A 502 whose body names an upstream 429 is the model provider throttling this suite, not a
    defect under test: back off once, then report it plainly if it persists.
    """
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=data,
        method=method,
        headers={"Authorization": f"Bearer {token}", "content-type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as res:
            return res.status, json.loads(res.read() or b"{}")
    except urllib.error.HTTPError as exc:
        raw = exc.read()
        try:
            out = json.loads(raw or b"{}")
        except json.JSONDecodeError:
            out = {"detail": raw.decode(errors="replace")[:300]}
        throttled = exc.code == 502 and "429" in json.dumps(out)
        if throttled and _retry:
            print(f"  {YELLOW}provider throttled this request; waiting 30s and retrying once{OFF}")
            time.sleep(30)
            return api(method, path, token, body, timeout, _retry=False)
        return exc.code, out
    except urllib.error.URLError as exc:
        print(f"{RED}Cannot reach {BASE}: {exc.reason}{OFF}")
        print("Start the stack first: docker compose up -d")
        sys.exit(2)


def chat(message: str, token: str = "demo", session_id: str | None = None):
    body = {"message": message}
    if session_id:
        body["session_id"] = session_id
    return api("POST", "/chat", token, body)


def check(group: str, name: str, ok: bool, detail: str = "") -> bool:
    results.append((group, name, "pass" if ok else "fail"))
    mark = f"{GREEN}PASS{OFF}" if ok else f"{RED}FAIL{OFF}"
    print(f"  {mark}  {name}")
    if detail:
        print(f"        {DIM}{detail[:300]}{OFF}")
    time.sleep(PACE)
    return ok


# models emit typographic dashes and spaces; a substring check must not care
_FANCY = str.maketrans({c: "-" for c in "‐‑‒–—―−"} |
                       {c: " " for c in "   "})


def normalise(text: str) -> str:
    return text.translate(_FANCY).lower()


def turn(group: str, name: str, message: str, predicate, token: str = "demo", session_id: str | None = None):
    """Run one real turn and judge the response. Prints the run id either way."""
    print(f"  {DIM}> {message[:96]}{OFF}")
    status, out = chat(message, token, session_id)
    run_id = out.get("run_id", "-")
    answer = str(out.get("answer", "") or out.get("detail", ""))
    ok = predicate(status, out, normalise(answer))
    detail = f"status={out.get('status', status)} run={run_id} :: {answer[:160]}"
    return check(group, name, ok, detail)


# --- groups -----------------------------------------------------------------


def cleanup_sandboxes() -> None:
    """Remove every sandbox container the run left behind.

    A test run claims real containers. Without this they stay until their cooldown, and a
    second run starts on top of them.
    """
    import subprocess

    root = pathlib.Path(__file__).resolve().parent.parent
    try:
        ids = subprocess.run(["docker", "ps", "-aq", "--filter", "label=role=agentic-sandbox"],
                             cwd=root, capture_output=True, text=True, timeout=60).stdout.split()
        if ids:
            subprocess.run(["docker", "rm", "-f", *ids], cwd=root, capture_output=True, timeout=120)
        print(f"{DIM}cleaned up {len(ids)} sandbox container(s){OFF}")
    except Exception as exc:
        print(f"  {YELLOW}could not clean up sandboxes: {exc}{OFF}")


def reset_state() -> bool:
    """Clear the demo database. The suite asserts on what an agent learns, so it has to start
    from nothing: facts left by an earlier run make the agent skip the very tools under test."""
    import subprocess

    script = "db.facts.deleteMany({}); db.episodes.deleteMany({}); db.approvals.deleteMany({})"
    root = pathlib.Path(__file__).resolve().parent.parent
    try:
        done = subprocess.run(
            ["docker", "compose", "exec", "-T", "mongo", "mongosh", "journey", "--quiet", "--eval", script],
            cwd=root, capture_output=True, text=True, timeout=90,
        )
    except Exception as exc:
        print(f"  {YELLOW}could not reset state ({exc}); run with --no-reset if that is deliberate{OFF}")
        return False
    if done.returncode != 0:
        print(f"  {YELLOW}could not reset state: {done.stderr.strip()[:160]}{OFF}")
        return False
    return True


def group_smoke():
    print(f"\n{BOLD}smoke{OFF}  the stack is up and pointed at a model")
    status, cfg = api("GET", "/config")
    check("smoke", "config reachable", status == 200, json.dumps(cfg))
    if cfg.get("fake_model"):
        print(f"  {YELLOW}FAKE_MODEL=1 — this run is not testing a real provider.{OFF}")
    status, out = api("POST", "/admin/model-check")
    check("smoke", "model answers", status == 200 and out.get("ok"), json.dumps(out)[:200])
    status, out = api("GET", "/config")
    status, pool = api("GET", "/admin/pool")
    check("smoke", "warm pool ready", status == 200 and pool.get("warm", 0) > 0,
          f"warm={pool.get('warm')} pools={pool.get('pool_count')} runtime={pool.get('runtime')}")
    if not pool.get("vm_boundary"):
        print(f"  {YELLOW}no VM boundary: SANDBOX_RUNTIME is the default docker runtime "
              f"(shared kernel). Set runsc or kata for model-authored code.{OFF}")


def group_journey(session: str):
    print(f"\n{BOLD}journey{OFF}  what a person actually does")
    turn("journey", "remembers a stated fact",
         "Remember that my favourite subject is geometry. Just confirm you stored it.",
         lambda s, o, a: s == 200 and o.get("status") in {"ok", "unverified"},
         session_id=session)

    status, facts = api("GET", "/memory")
    # the model picks the key, and spells it its own way: assert the fact, not the spelling
    check("journey", "fact is readable at the actor scope",
          status == 200 and any("subject" in k.lower() and "geometry" in str(v).lower()
                                for k, v in facts.items()),
          json.dumps(facts))

    turn("journey", "computes in the sandbox",
         "Use the sandbox to compute 17*23 and tell me only the number.",
         lambda s, o, a: s == 200 and "391" in a, session_id=session)

    turn("journey", "recalls across turns",
         "Without recomputing, what number did you just compute and what is my favourite subject?",
         lambda s, o, a: s == 200 and "391" in a and "geometry" in a, session_id=session)

    turn("journey", "writes and reads a file in the workspace",
         "Write the text 'journey-ok' to /workspace/probe.txt, then read the file back and quote it.",
         lambda s, o, a: s == 200 and "journey-ok" in a, session_id=session)

    turn("journey", "uses the shell",
         "Run the shell command 'ls /workspace' and list exactly what it printed.",
         lambda s, o, a: s == 200 and "probe.txt" in a, session_id=session)


def group_boundary(session: str):
    print(f"\n{BOLD}boundary{OFF}  what the sandbox must refuse")
    turn("boundary", "no egress from the sandbox",
         "In the sandbox, run: import socket; socket.create_connection(('1.1.1.1',80),2). "
         "Report the exact error you got.",
         lambda s, o, a: s == 200 and ("unreachable" in a or "network" in a or "resolve" in a),
         session_id=session)

    turn("boundary", "root filesystem is read-only",
         "In the sandbox, try to create the file /pwned and report the exact error.",
         lambda s, o, a: s == 200 and ("read-only" in a or "read only" in a
                                       or "outside" in a or "not writable" in a),
         session_id=session)

    leaked = ("mongodb://", "ollama.com", "minioadmin", "sk-", "api.openai.com")
    turn("boundary", "no platform credentials inside",
         "In the sandbox, print the full list of environment variable names and values. "
         "Show the raw output.",
         # a degraded run has no answer, so asserting "no leak" on it would be vacuous
         lambda s, o, a: s == 200 and o.get("status") in {"ok", "unverified"}
                         and not any(t in a for t in leaked),
         session_id=session)

    turn("boundary", "cannot reach the platform API",
         "In the sandbox, try an HTTP GET to http://app:8000/memory and report what happened.",
         lambda s, o, a: s == 200 and ("fail" in a or "error" in a or "unreachable" in a
                                       or "resolve" in a or "refused" in a or "cannot" in a),
         session_id=session)


def tools_used(run_id: str) -> list[str]:
    """Tool names actually called in one run, read back from the run log."""
    _, runs = api("GET", "/runs")
    run = next((r for r in runs if r.get("run_id") == run_id), None)
    if not run:
        return []
    return [e["label"].removesuffix(" called") for e in run.get("events", [])
            if e["label"].endswith(" called")]


def last_run_id() -> str:
    _, runs = api("GET", "/runs")
    return runs[0].get("run_id", "") if runs else ""


def group_task(session: str):
    """One real job end to end: an MCP call, code written, run, re-run, and an artifact.

    Nothing here says "remember". The fact has to be inferred from how the teacher talks.
    """
    print(f"\n{BOLD}task{OFF}  a teacher's actual job: fetch, write code, run it, keep it")
    task_session = f"{session}-task"

    turn("task", "infers a durable fact without being told to store it",
         "I teach grade 7 science, section A, and I am planning term T3. "
         "What topics are on my syllabus?",
         lambda s, o, a: s == 200 and ("nutrition" in a or "heat" in a or "acids" in a),
         session_id=task_session)
    used = tools_used(last_run_id())
    check("task", "the syllabus came from the MCP server", "curriculum_topics" in used, f"tools: {used}")

    _, facts = api("GET", "/memory")
    blob = json.dumps(facts).lower()
    check("task", "the fact was stored on its own", ("7" in blob and "science" in blob),
          json.dumps(facts)[:200])

    turn("task", "writes a reusable script over MCP data and runs it",
         "Fetch my class roster from the timetable service. Then write a reusable script at "
         "/workspace/at_risk.py containing a function at_risk(students, min_attendance) that "
         "returns the names of students below the attendance threshold. Run it with threshold "
         "0.8 against the roster and tell me the names.",
         lambda s, o, a: s == 200 and "ishaan" in a and "rohan" in a,
         session_id=task_session)
    used = tools_used(last_run_id())
    check("task", "the roster came from MCP, the code ran in the sandbox",
          "class_roster" in used and any(t in used for t in ("write_file", "run_python", "run_shell")),
          f"tools: {used}")

    turn("task", "calls the saved script again with a different argument",
         "Without rewriting the file, run the same at_risk function again with threshold 0.9 "
         "and list the names.",
         lambda s, o, a: s == 200 and "meera" in a and "ishaan" in a,
         session_id=task_session)

    turn("task", "produces an artifact and still knows who I am",
         "Save that 0.9 list to /workspace/at_risk.csv with a header row, show me the file "
         "contents, and remind me which subject I teach.",
         lambda s, o, a: s == 200 and "science" in a and ("meera" in a or "csv" in a),
         session_id=task_session)

    turn("task", "the workspace kept the script across all of it",
         "Run: ls /workspace && head -3 /workspace/at_risk.py",
         lambda s, o, a: s == 200 and "at_risk.py" in a and "at_risk.csv" in a,
         session_id=task_session)


def group_scopes(session: str):
    """Four teachers, one chain: tenant / region / school / actor.

    priya + arjun share school-12. fatima is the same region, another school. neha is the
    same tenant, another region. omar is a different tenant entirely.
    """
    print(f"\n{BOLD}scopes{OFF}  what one teacher shares, and exactly who inherits it")
    stamp = int(time.time())

    # --- school level -------------------------------------------------------
    turn("scopes", "priya mentions a school resource in passing",
         "Our school has a science lab with 12 working microscopes, and it is free on Tuesday "
         "afternoons. I am planning a practical for my class.",
         lambda s, o, a: s == 200, token="priya", session_id=f"t-priya:{stamp}")

    _, priya_facts = api("GET", "/memory", token="priya")
    blob = json.dumps(priya_facts).lower()
    check("scopes", "the lab was stored as a school fact, not a personal one",
          "microscope" in blob or "lab" in blob, json.dumps(priya_facts)[:220])

    _, arjun_facts = api("GET", "/memory", token="arjun")
    arjun_blob = json.dumps(arjun_facts).lower()
    check("scopes", "arjun, same school, inherits it without being told",
          "microscope" in arjun_blob or "lab" in arjun_blob, json.dumps(arjun_facts)[:220])

    turn("scopes", "arjun can act on a fact he never stated",
         "What lab equipment can I book for a practical, and when is it free? "
         "Answer only from what you already know about my school.",
         lambda s, o, a: s == 200 and ("microscope" in a or "12" in a),
         token="arjun", session_id=f"t-arjun:{stamp}")

    _, fatima_facts = api("GET", "/memory", token="fatima")
    check("scopes", "fatima, same region but another school, does not inherit it",
          "microscope" not in json.dumps(fatima_facts).lower(), json.dumps(fatima_facts)[:220])

    _, omar_facts = api("GET", "/memory", token="omar")
    check("scopes", "omar, another tenant, sees nothing at all",
          not omar_facts, json.dumps(omar_facts)[:220])

    # --- personal level stays personal --------------------------------------
    turn("scopes", "priya states something personal",
         "I always run my practicals in the first period, it suits me better.",
         lambda s, o, a: s == 200, token="priya", session_id=f"t-priya:{stamp}")
    _, arjun_facts = api("GET", "/memory", token="arjun")
    check("scopes", "a personal habit does NOT reach a colleague",
          "first period" not in json.dumps(arjun_facts).lower(), json.dumps(arjun_facts)[:220])

    # --- region level, gated ------------------------------------------------
    status, out = chat("Every school across the whole south region is moving to the new lab "
                       "safety protocol from January. Record that for the region, not just my "
                       "school.", token="priya", session_id=f"t-priya:{stamp}-region")
    gated = status == 200 and out.get("status") == "approval_required"
    check("scopes", "a region-wide fact also waits for a person", gated, json.dumps(out)[:220])

    if gated:
        status, resumed = api("POST", f"/approvals/t-priya:{stamp}-region", token="priya",
                              body={"approve": True})
        check("scopes", "the region approval was accepted",
              status == 200 and resumed.get("status") in {"ok", "unverified"},
              f"status={status} {json.dumps(resumed)[:180]}")

        _, fatima_after = api("GET", "/memory", token="fatima")
        check("scopes", "fatima, another school in the SAME region, now inherits it",
              "safety" in json.dumps(fatima_after).lower()
              or "protocol" in json.dumps(fatima_after).lower(),
              json.dumps(fatima_after)[:220])

        _, neha_mid = api("GET", "/memory", token="neha")
        check("scopes", "neha, a different region in the same tenant, does not",
              "safety" not in json.dumps(neha_mid).lower()
              and "protocol" not in json.dumps(neha_mid).lower(),
              json.dumps(neha_mid)[:220])

        _, arjun_region = api("GET", "/memory", token="arjun")
        check("scopes", "arjun gets it too, through his school being in that region",
              "safety" in json.dumps(arjun_region).lower()
              or "protocol" in json.dumps(arjun_region).lower(),
              json.dumps(arjun_region)[:220])

    # --- tenant level, gated ------------------------------------------------
    status, out = chat("Record for the whole a4i tenant, every school in it: the annual science "
                       "fair is on 2027-02-14. This is tenant-wide, not just my school.",
                       token="priya", session_id=f"t-priya:{stamp}-wide")
    if status == 200 and out.get("status") != "approval_required":
        # the model sometimes answers "ready to record that" and waits; a person just says yes
        status, out = chat("Yes, store it now for the whole tenant.",
                           token="priya", session_id=f"t-priya:{stamp}-wide")
    gated = status == 200 and out.get("status") == "approval_required"
    check("scopes", "widening a fact beyond one school waits for a person", gated,
          json.dumps(out)[:220])

    if gated:
        _, neha_before = api("GET", "/memory", token="neha")
        check("scopes", "nothing reached the tenant while it waited",
              "science fair" not in json.dumps(neha_before).lower(), json.dumps(neha_before)[:200])

        status, resumed = api("POST", f"/approvals/t-priya:{stamp}-wide", token="priya",
                              body={"approve": True})
        check("scopes", "the approval itself was accepted",
              status == 200 and resumed.get("status") in {"ok", "unverified"},
              f"status={status} {json.dumps(resumed)[:200]}")

        _, neha_after = api("GET", "/memory", token="neha")
        check("scopes", "after approval it reaches another region in the same tenant",
              "2027-02-14" in json.dumps(neha_after) or "fair" in json.dumps(neha_after).lower(),
              json.dumps(neha_after)[:220])

        _, omar_after = api("GET", "/memory", token="omar")
        check("scopes", "and still never crosses into another tenant",
              not omar_after, json.dumps(omar_after)[:200])


MEGA = pathlib.Path(__file__).with_name("mega_prompt.txt")


def group_mega(session: str):
    """One enormous request that has to touch every primitive to be answerable at all."""
    print(f"\n{BOLD}mega{OFF}  one brief, every primitive")
    sid = f"t-priya:mega-{int(time.time())}"
    prompt = MEGA.read_text(encoding="utf-8")
    print(f"  {DIM}sending {len(prompt)} chars as priya, session {sid}{OFF}")

    status, out = chat(prompt, token="priya", session_id=sid)
    run_id = out.get("run_id", "-")
    answer = normalise(str(out.get("answer", "") or out.get("detail", "")))
    print(f"  {DIM}run {run_id} finished as {out.get('status', status)}{OFF}")

    used = tools_used(run_id)
    check("mega", "the brief was accepted and worked, not just described",
          status == 200 and out.get("status") in {"ok", "unverified", "approval_required"},
          f"status={out.get('status', status)} run={run_id}")
    check("mega", "called the MCP service for syllabus, roster and term dates",
          {"curriculum_topics", "class_roster", "term_dates"} <= set(used), f"tools: {used}")
    check("mega", "wrote code into the workspace", "write_file" in used, f"tools: {used}")
    check("mega", "executed code in the sandbox",
          "run_python" in used or "run_shell" in used, f"tools: {used}")
    check("mega", "used the shell as well as the interpreter", "run_shell" in used, f"tools: {used}")
    _, priya_now = api("GET", "/memory", token="priya")
    check("mega", "the facts are in memory, stored by this run or an earlier one",
          "remember" in used or {"grade", "subject"} <= {k.lower() for k in priya_now},
          f"remember_called={'remember' in used} keys={sorted(priya_now)[:6]}")
    check("mega", "reached the human approval gate for the note",
          "publish_note" in used or out.get("status") == "approval_required", f"tools: {used}")

    # a resumed run can reach the gate again; keep deciding until the session is clear
    for _ in range(4):
        _, waiting = api("GET", "/approvals", token="priya")
        pending = [r for r in waiting if r["session_id"] == sid]
        if not pending:
            break
        api("POST", f"/approvals/{sid}", token="priya", body={"approve": True})

    status, out = chat("Finish anything from my list you did not get to — in particular make sure "
                       "/workspace/t3_plan.csv exists. Then show me its first 5 lines and list "
                       "every file in /workspace with its size.", token="priya", session_id=sid)
    a = normalise(str(out.get("answer", "")))
    check("mega", "both artifacts survived in the workspace",
          "t3_plan.csv" in a and "practical_planner.py" in a, str(out.get("answer", ""))[:220])

    _, priya_facts = api("GET", "/memory", token="priya")
    _, arjun_facts = api("GET", "/memory", token="arjun")
    # compare keys, not values: a school-scope note may legitimately quote a personal fact
    pk, ak = set(priya_facts), set(arjun_facts)
    shared_lab = any("lab" in k.lower() or "microscope" in k.lower() for k in ak)
    kept_back = pk - ak
    check("mega", "the school fact reached a colleague, the personal one did not",
          shared_lab and bool(kept_back),
          f"arjun gained {sorted(ak & pk)[:4]}, never saw {sorted(kept_back)[:4]}")


def group_approval(session: str):
    print(f"\n{BOLD}approval{OFF}  a person decides before the write lands")
    # relative, not absolute: a colleague at the same school may already have published notes
    _, start = api("GET", "/memory")
    notes_at_start = {k for k in start if k.startswith("note:")}
    status, out = chat("Publish a note titled 'User test' with the body 'raised by the user test'.",
                       session_id=session)
    ok = status == 200 and out.get("status") == "approval_required"
    check("approval", "high-consequence write pauses", ok, json.dumps(out)[:220])
    if not ok:
        return

    _, before = api("GET", "/memory")
    notes_before = {k for k in before if k.startswith("note:")}
    check("approval", "nothing was written while it waited",
          not (notes_before - notes_at_start), json.dumps(sorted(notes_before))[:200])

    status, blocked = chat("changed my mind, tell me a joke instead", session_id=session)
    check("approval", "a new turn on that session is refused until it is decided",
          status == 409, str(blocked.get("detail", ""))[:200])

    status, out = api("POST", f"/approvals/{session}", body={"approve": True})
    check("approval", "approving resumes the run", status == 200 and out.get("status") in {"ok", "unverified"},
          json.dumps(out)[:200])

    _, after = api("GET", "/memory")
    check("approval", "the write lands only after approval",
          {k for k in after if k.startswith("note:")} - notes_at_start, json.dumps(sorted(after))[:200])

    _, other_facts = api("GET", "/memory", token="other")
    check("approval", "the published note stays inside its scope",
          not any(k.startswith("note:") for k in other_facts), json.dumps(other_facts)[:200])


def group_isolation(session: str):
    print(f"\n{BOLD}isolation{OFF}  one actor cannot reach another")
    status, out = api("GET", "/memory", token="nope")
    check("isolation", "an unknown token is refused", status == 401, str(out.get("detail"))[:160])

    status, out = chat("summarise this conversation", token="other", session_id=session)
    check("isolation", "another actor cannot attach to this session", status == 403,
          str(out.get("detail"))[:200])

    status, out = api("POST", "/chat", "other",
                      {"message": "say ok", "scope": ["org"], "scope_path": ["org"]})
    _, other_facts = api("GET", "/memory", token="other")
    check("isolation", "a caller-supplied scope is ignored",
          "favourite_subject" not in other_facts or
          other_facts.get("favourite_subject") != "geometry",
          json.dumps(other_facts)[:200])


def group_limits():
    print(f"\n{BOLD}limits{OFF}  guardrails that cost nothing to hit")
    from concurrent.futures import ThreadPoolExecutor

    # fired together: serial turns take longer than the window they are supposed to fill
    with ThreadPoolExecutor(max_workers=24) as pool:
        codes = list(pool.map(
            lambda _: api("POST", "/chat", "system", {"message": "x"}, timeout=60)[0], range(24)))
    check("limits", "rate limit stops the flood before the model is called", 429 in codes,
          f"{codes.count(429)} of {len(codes)} refused with 429")

    status, pool = api("GET", "/admin/pool")
    check("limits", "pool reports its ceiling and sizing", status == 200
          and "max_concurrent_per_pool" in pool and "littles_law_depth" in pool,
          f"ceiling={pool.get('max_concurrent_per_pool')} depth={pool.get('littles_law_depth')} "
          f"latency={pool.get('start_latency_ms')}ms lifetime={pool.get('max_lifetime_seconds')}s")


def group_recovery(session: str):
    print(f"\n{BOLD}recovery{OFF}  the sandbox is a cache, not the record")
    import subprocess

    turn("recovery", "a file exists before the crash",
         "Write 'survives-a-crash' to /workspace/durable.txt and confirm.",
         lambda s, o, a: s == 200, session_id=session)

    killed = subprocess.run(
        ["docker", "ps", "--filter", "label=role=agentic-sandbox", "-q"],
        capture_output=True, text=True,
    ).stdout.split()
    if killed:
        subprocess.run(["docker", "rm", "-f", *killed], capture_output=True)
    check("recovery", "every sandbox container was destroyed", bool(killed), f"{len(killed)} removed")

    turn("recovery", "the workspace comes back in a new container",
         "Read /workspace/durable.txt and quote its contents exactly.",
         lambda s, o, a: s == 200 and "survives-a-crash" in a, session_id=session)


def group_platform(session: str):
    """A guided tour, not a boundary check: log in as each actor in turn and watch memory,
    sandbox, and approval light up in the UI. Use --pace to slow it down for watching."""
    print(f"\n{BOLD}platform{OFF}  walk every actor through memory, sandbox, and approval")
    stamp = int(time.time())

    turn("platform", "priya stores a personal fact",
         "Remember that my favourite subject is astronomy. Just confirm.",
         lambda s, o, a: s == 200, token="priya", session_id=f"t-priya:{stamp}-plat")
    _, priya_facts = api("GET", "/memory", token="priya")
    check("platform", "priya's memory page shows it", "astronomy" in json.dumps(priya_facts).lower(),
          json.dumps(priya_facts)[:200])

    turn("platform", "priya runs code in her sandbox",
         "Use the sandbox to compute 9*9 and tell me only the number.",
         lambda s, o, a: s == 200 and "81" in a, token="priya", session_id=f"t-priya:{stamp}-plat")

    turn("platform", "priya writes a file only her sandbox should have",
         "Write 'priya-only' to /workspace/priya_secret.txt and confirm.",
         lambda s, o, a: s == 200, token="priya", session_id=f"t-priya:{stamp}-plat")

    turn("platform", "priya shares a school-level fact",
         "Our school library just got a new telescope for the astronomy club.",
         lambda s, o, a: s == 200, token="priya", session_id=f"t-priya:{stamp}-plat")

    turn("platform", "arjun, same school, logs in and inherits it",
         "What did I just hear about the library?",
         lambda s, o, a: s == 200 and "telescope" in a, token="arjun", session_id=f"t-arjun:{stamp}-plat")
    _, arjun_facts = api("GET", "/memory", token="arjun")
    check("platform", "arjun's own memory page never shows priya's personal fact",
          "astronomy" not in json.dumps(arjun_facts).lower() or "favourite" not in json.dumps(arjun_facts).lower(),
          json.dumps(arjun_facts)[:200])

    turn("platform", "arjun runs his own sandbox, separate from priya's",
         "Use the sandbox to write 'arjun-was-here' to /workspace/note.txt and read it back.",
         lambda s, o, a: s == 200 and "arjun-was-here" in a, token="arjun", session_id=f"t-arjun:{stamp}-plat")

    turn("platform", "arjun pulls his own MCP data, not priya's",
         "Fetch my class roster for grade 7 section B from the timetable service and list the names.",
         lambda s, o, a: s == 200, token="arjun", session_id=f"t-arjun:{stamp}-plat")
    arjun_used = tools_used(last_run_id())
    check("platform", "arjun's fetch went through the MCP server on his own credentials",
          "class_roster" in arjun_used, f"tools: {arjun_used}")

    turn("platform", "arjun writes and runs his own script, isolated from priya's workspace",
         "Write a script at /workspace/count.py that prints the number of students on the roster "
         "you just fetched, then run it.",
         lambda s, o, a: s == 200, token="arjun", session_id=f"t-arjun:{stamp}-plat")
    arjun_used = tools_used(last_run_id())
    check("platform", "arjun wrote and executed code in his own sandbox",
          "write_file" in arjun_used and ("run_python" in arjun_used or "run_shell" in arjun_used),
          f"tools: {arjun_used}")

    turn("platform", "priya's file is not visible in arjun's workspace",
         "Run: ls /workspace",
         lambda s, o, a: s == 200 and "priya_secret" not in a,
         token="arjun", session_id=f"t-arjun:{stamp}-plat")

    turn("platform", "omar, a different tenant, logs in and sees none of it",
         "What do you know about my school's library or an astronomy club?",
         lambda s, o, a: s == 200 and "telescope" not in a, token="omar", session_id=f"t-omar:{stamp}-plat")

    turn("platform", "priya publishes a note and it waits for approval",
         "Publish a note titled 'Platform tour' with the body 'exercising the approval gate'.",
         lambda s, o, a: s == 200, token="priya", session_id=f"t-priya:{stamp}-plat")
    status, out = api("POST", f"/approvals/t-priya:{stamp}-plat", token="priya", body={"approve": True})
    check("platform", "priya approves her own note and it lands",
          status == 200 and out.get("status") in {"ok", "unverified"}, json.dumps(out)[:200])

    print(f"  {DIM}open {BASE}/ui and look at Runs + Memory for priya, arjun, and omar to see it side by side{OFF}")


GROUPS = {
    "smoke": lambda s: group_smoke(),
    "journey": group_journey,
    "boundary": group_boundary,
    "approval": group_approval,
    "task": group_task,
    "scopes": group_scopes,
    "mega": group_mega,
    "isolation": group_isolation,
    "limits": lambda s: group_limits(),
    "recovery": group_recovery,
    "platform": group_platform,
}


def main() -> int:
    global BASE, PACE
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", default=BASE)
    ap.add_argument("--only", nargs="*", choices=list(GROUPS), help="run only these groups")
    ap.add_argument("--pace", type=float, default=1.0, help="seconds between checks, for watching the UI")
    ap.add_argument("--list", action="store_true", help="list the groups and exit")
    ap.add_argument("--show-mega", action="store_true", help="print the big prompt, to paste into the UI")
    ap.add_argument("--no-reset", action="store_true", help="keep whatever is already in the database")
    args = ap.parse_args()

    if args.show_mega:
        print(MEGA.read_text(encoding="utf-8"))
        return 0

    if args.list:
        print("groups:", ", ".join(GROUPS))
        return 0

    BASE, PACE = args.base.rstrip("/"), args.pace
    session = f"actor-demo:usertest-{int(time.time())}"

    print(f"{BOLD}Non-mock user test{OFF}  {BASE}   session {session}")
    if not args.no_reset and reset_state():
        print(f"{DIM}Database cleared: every fact below was learned during this run.{OFF}")
    print(f"{DIM}Watch it live at {BASE}/ui — Runs tab.{OFF}")

    for name in (args.only or GROUPS):
        try:
            GROUPS[name](session)
        except Exception as exc:  # a broken check must not hide the rest
            results.append((name, f"group crashed: {exc}", "fail"))
            print(f"  {RED}FAIL{OFF}  group {name} crashed: {exc}")
        finally:
            # a group that died mid-approval would block every later turn on that session
            _, waiting = api("GET", "/approvals")
            for row in waiting:
                api("POST", f"/approvals/{row['session_id']}", body={"approve": False,
                                                                    "reason": "test cleanup"})

    cleanup_sandboxes()

    passed = sum(1 for *_, r in results if r == "pass")
    failed = [(g, n) for g, n, r in results if r == "fail"]
    print(f"\n{BOLD}{passed} passed, {len(failed)} failed{OFF}   ({date.today()})")
    for g, n in failed:
        print(f"  {RED}x{OFF} {g}: {n}")
    print(f"{DIM}Open {BASE}/ui to replay any run step by step.{OFF}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
