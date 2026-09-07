"""Hooks. Every one binds to a pydantic-ai extension point. No hook layer of our own."""
import pathlib
import time
from typing import Any

from opentelemetry import trace
from pydantic_ai import (
    ApprovalRequired,
    CallDeferred,
    ModelRetry,
    RunContext,
    ToolsetTool,
    WrapperToolset,
)

from . import memory, runs
from .deps import Deps

_tracer = trace.get_tracer("agentic-journey")
_PROMPTS = pathlib.Path(__file__).resolve().parent.parent / "prompts"


def read_prompt(name: str) -> tuple[str, str]:
    """Returns (version, text). A prompt change is invisible in a trace unless it is versioned."""
    head, _, body = _PROMPTS.joinpath(f"{name}.md").read_text(encoding="utf-8").partition("\n")
    return head.removeprefix("version:").strip(), body.strip()


def instructions_for(profile: str):
    """Before each request: inject scope-bound memory, and stamp the prompt version on the span."""
    version, text = read_prompt(profile)

    async def instructions(ctx: RunContext[Deps]) -> str:
        span = trace.get_current_span()
        span.set_attribute("journey.session_id", ctx.deps.session_id)
        span.set_attribute("journey.actor_id", ctx.deps.identity.actor_id)
        span.set_attribute("journey.prompt.name", profile)
        span.set_attribute("journey.prompt.version", version)
        known = memory.retrieve(ctx.deps.identity)
        runs.event(ctx.deps.run_id, "memory", "scoped facts injected", f"{len(known)} fact(s)")
        facts = "\n".join(f"- {k}: {v}" for k, v in known.items()) or "- (none)"
        return f"{text}\n\nKnown facts for this actor:\n{facts}"

    return instructions


async def prepare_tools(ctx: RunContext[Deps], tool_defs: list) -> list:
    """Before each step: an actor at the root scope has nowhere to publish, so hide the tool."""
    if len(ctx.deps.identity.scope_path) < 2:
        return [t for t in tool_defs if t.name != "publish_note"]
    return tool_defs


class TimedToolset(WrapperToolset):
    """One tool call: time it, span it, and turn a bad call into a retry instead of a dead stream."""

    async def call_tool(
        self, name: str, tool_args: dict[str, Any], ctx: RunContext, tool: ToolsetTool
    ) -> Any:
        with _tracer.start_as_current_span(f"tool.{name}") as span:
            span.set_attribute("journey.session_id", getattr(ctx.deps, "session_id", "?"))
            started = time.monotonic()
            run_id = getattr(ctx.deps, "run_id", "")
            node = "sandbox" if name == "run_python" else "tools"
            runs.event(run_id, node, f"{name} called", str(tool_args)[:200], state="active")
            try:
                result = await super().call_tool(name, tool_args, ctx, tool)
                runs.event(run_id, node, f"{name} returned", str(result)[:200])
                return result
            except ApprovalRequired:
                runs.event(run_id, "approval", f"{name} held for a person", str(tool_args)[:200], state="blocked")
                raise
            except (ModelRetry, CallDeferred):
                raise  # framework control flow, not a tool failure
            except Exception as exc:  # keep the output, re-prompt for a correction
                span.record_exception(exc)
                runs.event(run_id, node, f"{name} failed", str(exc)[:200], state="error")
                raise ModelRetry(f"Tool {name} failed: {exc}. Fix the arguments and call it again.")
            finally:
                span.set_attribute("journey.tool.duration_ms", (time.monotonic() - started) * 1000)
