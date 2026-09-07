"""One turn. The interactive path and the scheduled path both end up here."""
import uuid
from datetime import date

from fastapi import HTTPException
from opentelemetry import trace
from pydantic_ai import DeferredToolRequests, DeferredToolResults, ModelRetry, ToolDenied
from pydantic_ai.exceptions import UnexpectedModelBehavior, UsageLimitExceeded
from pydantic_ai.messages import ModelMessagesTypeAdapter

from . import agent as agent_mod
from . import config
from . import guardrails, memory, runs, sandbox, subagents
from .deps import Deps
from .identity import Identity

_tracer = trace.get_tracer("agentic-journey")


def _usage_of(result) -> dict:
    """Token counts as the framework reports them; absent fields simply stay zero."""
    u = getattr(result, "usage", None)
    if callable(u):          # a method in pydantic-ai 1.x, a property in 2.x
        try:
            u = u()
        except Exception:
            return {}
    if u is None:
        return {}
    return {
        "model": config.MODEL_NAME,
        "requests": getattr(u, "requests", 0) or 0,
        "input_tokens": getattr(u, "input_tokens", 0) or 0,
        "output_tokens": getattr(u, "output_tokens", 0) or 0,
        "tool_calls": getattr(u, "tool_calls", 0) or 0,
    }


def session_for(ident: Identity) -> str:
    return f"{ident.actor_id}:{date.today().isoformat()}"


def _agent_with_output_control(question: str, deps: Deps):
    ag = agent_mod.make_agent("journey")

    @ag.output_validator
    async def _check(ctx, output):
        if not isinstance(output, str):
            return output  # an approval request is not an answer yet
        try:
            verdict = await subagents.verify(question, output, deps)
        except Exception as exc:
            # a weaker OpenAI-compatible endpoint may not do typed output at all
            deps.verifier_failed = str(exc)[:200]
            runs.event(deps.run_id, "verifier", "verifier unavailable", deps.verifier_failed, state="error")
            return output
        runs.event(
            deps.run_id,
            "verifier",
            "verdict ok" if verdict.ok else "verdict rejected",
            verdict.reason,
            state="done" if verdict.ok else "error",
        )
        if verdict.ok:
            return output
        if deps.first_answer is None:
            # one chance to fix a real defect
            deps.first_answer = output
            raise ModelRetry(f"A verifier rejected this answer: {verdict.reason}. Correct it.")
        # rejected twice: keep the ORIGINAL answer and label it. A verifier that can force a
        # rewrite can grind a correct answer into whatever passes, which is worse than a flag.
        deps.unverified_reason = verdict.reason
        return deps.first_answer

    return ag


async def run_turn(
    ident: Identity,
    message: str | None,
    session_id: str | None = None,
    deferred: DeferredToolResults | None = None,
    history=None,
) -> dict:
    if session_id:
        # one sandbox, one actor: a session id is not a capability anyone may present
        owner = memory.episode_owner(session_id)
        if owner not in (None, ident.actor_id) or not session_id.startswith(f"{ident.actor_id}:"):
            raise HTTPException(
                403,
                f"Session {session_id!r} belongs to another actor. Omit session_id to use your own "
                f"session, or pass one that starts with {ident.actor_id!r}.",
            )
    session_id = session_id or session_for(ident)
    run_id = uuid.uuid4().hex[:12]
    runs.start(run_id, session_id, ident.actor_id, message)
    guardrails.check_rate(ident.actor_id)
    if deferred is None and guardrails.has_pending(session_id):
        # the history holds an unanswered tool call; a person owes it a decision first
        runs.finish(run_id, "blocked")
        raise HTTPException(
            409,
            f"Session {session_id!r} is waiting for a person to approve or deny a tool call. "
            f"Decide it first: POST /approvals/{session_id} with {{\"approve\": true}} or "
            "{\"approve\": false}, or use the Approvals tab in the console.",
        )
    try:
        sandbox.capacity_check(session_id)
    except sandbox.PoolFull as exc:
        runs.finish(run_id, "blocked")
        raise HTTPException(503, str(exc))
    runs.event(run_id, "identity", "scope resolved", "/".join(ident.scope_path))
    runs.event(run_id, "guardrails", "rate check passed")
    deps = Deps(ident, session_id, run_id)

    if history is None:
        stored = memory.load_episode(session_id)["messages"]
        history = ModelMessagesTypeAdapter.validate_python(stored) if stored else []
        runs.event(run_id, "episode", "episodic window loaded", f"{len(history)} message(s)")

    ag = _agent_with_output_control(message or "", deps)
    with _tracer.start_as_current_span("journey.turn") as span:
        span.set_attribute("journey.session_id", session_id)
        span.set_attribute("journey.actor_id", ident.actor_id)
        try:
            result = await ag.run(
                message,
                deps=deps,
                message_history=history,
                deferred_tool_results=deferred,
                usage_limits=agent_mod.BUDGETS["journey"],
            )
        except (UnexpectedModelBehavior, UsageLimitExceeded) as exc:
            # no silent fallback: a degraded result never leaves here looking like a success
            span.record_exception(exc)
            runs.event(run_id, "verifier", "run gave up", str(exc)[:200], state="error")
            runs.finish(run_id, "degraded")
            return {"status": "degraded", "session_id": session_id, "run_id": run_id, "detail": str(exc)}

    memory.save_episode(
        session_id,
        ident,
        ModelMessagesTypeAdapter.dump_python(result.all_messages(), mode="json"),
        f"{session_id}.tar",
    )

    runs.event(run_id, "episode", "episodic window saved")
    spend = _usage_of(result)

    if isinstance(result.output, DeferredToolRequests):
        calls = guardrails.save_pending(session_id, result.all_messages(), result.output)
        runs.finish(run_id, "approval_required")
        return {"status": "approval_required", "session_id": session_id, "run_id": run_id, "calls": calls}

    guardrails.clear_pending(session_id)
    if deps.unverified_reason:
        runs.finish(run_id, "unverified", str(result.output), spend)
        return {
            "status": "unverified",
            "session_id": session_id,
            "run_id": run_id,
            "answer": result.output,
            "detail": f"The verifier rejected this answer twice: {deps.unverified_reason}. "
                      "The original answer is returned unchanged and unconfirmed — a verifier "
                      "may flag an answer, never rewrite it.",
        }
    if deps.verifier_failed:
        # an unverified answer is not a verified one, and never claims to be
        runs.finish(run_id, "unverified", str(result.output), spend)
        return {
            "status": "unverified",
            "session_id": session_id,
            "run_id": run_id,
            "answer": result.output,
            "detail": f"The verifier subagent could not run: {deps.verifier_failed}. "
                      "The answer is unchecked. Set VERIFIER_MODEL_NAME to a model that supports "
                      "typed output, or set VERIFIER_ENABLED=0 to accept unchecked answers.",
        }
    runs.finish(run_id, "ok", str(result.output), spend)
    return {"status": "ok", "session_id": session_id, "run_id": run_id, "answer": result.output}


async def resume_with_approval(ident: Identity, session_id: str, approve: bool, reason: str = "") -> dict:
    history, calls = guardrails.load_pending(session_id)
    results = DeferredToolResults()
    for call in calls:
        results.approvals[call["tool_call_id"]] = True if approve else ToolDenied(reason or "denied by a person")
    # clear only once the resumed run has actually happened: clearing first means any failure
    # (a rejected session id, a provider error) destroys the decision with nothing to retry
    out = await run_turn(ident, None, session_id, deferred=results, history=history)
    if out.get("status") != "approval_required":
        guardrails.clear_pending(session_id)
    return out
