"""A subagent runs bounded work in its own context: one goal, one budget, one output contract."""
from dataclasses import dataclass

from . import agent as agent_mod
from . import config, runs
from .deps import Deps


@dataclass
class Verdict:
    ok: bool
    reason: str


_verifier = agent_mod.make_agent("verifier", model_name=config.VERIFIER_MODEL_NAME, output_type=Verdict)


def _history(session_id: str, keep: int = 4) -> str:
    """A tail of the session, so a claim resting on an earlier turn is not read as invented."""
    from . import memory

    stored = memory.load_episode(session_id).get("messages") or []
    lines = []
    for msg in stored[-keep:]:
        for part in msg.get("parts", []):
            text = str(part.get("content", ""))[:200]
            if text and part.get("part_kind") in {"user-prompt", "text", "tool-return"}:
                lines.append(f"- {part.get('part_kind')}: {text}")
    return "\n".join(lines[-keep:]) or "- (nothing earlier in this session)"


def _evidence(run_id: str) -> str:
    """The tool calls of this turn. Without them the verifier rejects true answers as invented."""
    doc = runs.runs.find_one({"_id": run_id}) or {}
    lines = [
        f"- {e['label']}: {e['detail']}"
        for e in doc.get("events", [])
        if e["node"] in {"tools", "sandbox"} and e["detail"]
    ]
    return "\n".join(lines) or "- (no tool was called this turn)"


async def verify(question: str, answer: str, deps: Deps) -> Verdict:
    """Verification, not parallelism. The cheap model serves the narrow subagent."""
    if config.FAKE_MODEL:
        return Verdict(ok=True, reason="fake model: verification skipped")
    if not config.VERIFIER_ENABLED:
        return Verdict(ok=True, reason="verifier disabled by configuration")
    run = await _verifier.run(
        f"Question:\n{question}\n\n"
        f"Earlier in this session:\n{_history(deps.session_id)}\n\n"
        f"Evidence, the tool calls of this turn:\n{_evidence(deps.run_id)}\n\n"
        f"Answer:\n{answer}\n\nIs the answer sound?",
        deps=deps,
        usage_limits=agent_mod.BUDGETS["verifier"],
    )
    return run.output
