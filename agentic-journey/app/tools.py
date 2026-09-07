"""Tool registry. Each agent gets a curated subset, not the whole registry."""
from pydantic_ai import FunctionToolset, ModelRetry, RunContext

from . import memory, sandbox
from .deps import Deps


async def remember(
    ctx: RunContext[Deps],
    key: str,
    value: str,
    shared_with: str = "actor",
    expires_in_hours: float | None = None,
) -> str:
    """Store a durable fact.

    shared_with picks how far it reaches, inside this actor's own chain only:
    "actor" (private, the default), "school" (everyone at their school), "region", "tenant".
    Sharing wider than a school waits for a person to approve it.

    expires_in_hours sets a shelf life. Use it for anything true now but not next week —
    weather, a closure, a room swap for today. Leave it unset for a durable fact.
    """
    try:
        scope = ctx.deps.identity.scope_at(shared_with)
    except ValueError as exc:
        raise ModelRetry(str(exc))
    memory.write_fact(ctx.deps.identity, key, value, scope_path=scope, ttl_hours=expires_in_hours)
    window = f", expires in {expires_in_hours}h" if expires_in_hours else ""
    return f"stored {key} at {'/'.join(scope)}{window}"


async def recall(ctx: RunContext[Deps]) -> dict[str, str]:
    """Read every fact visible to this actor's scope."""
    return memory.retrieve(ctx.deps.identity)


async def run_python(ctx: RunContext[Deps], code: str) -> str:
    """Run Python in the actor's sandbox. No network. Files under /workspace persist across turns."""
    if not code.strip():
        raise ModelRetry("run_python needs a non-empty `code` argument.")
    return await sandbox.run_code(ctx.deps.session_id, code)


async def run_shell(ctx: RunContext[Deps], command: str) -> str:
    """Run a shell command in the actor's sandbox. No network. /workspace persists across turns."""
    if not command.strip():
        raise ModelRetry("run_shell needs a non-empty `command` argument.")
    return await sandbox.run_shell(ctx.deps.session_id, command)


def _in_workspace(path: str) -> str:
    """A path outside /workspace is refused, not quietly relocated. Silence would hide the boundary."""
    if path.startswith("/") and not path.startswith("/workspace/"):
        raise ModelRetry(
            f"{path!r} is outside the writable area. Only /workspace is writable in the sandbox; "
            "the rest of the filesystem is read-only. Use a path under /workspace, or use "
            "run_shell if you meant to observe the failure."
        )
    return path if path.startswith("/workspace/") else f"/workspace/{path.lstrip('/')}"


async def write_file(ctx: RunContext[Deps], path: str, content: str) -> str:
    """Write a file under /workspace in the actor's sandbox."""
    target = _in_workspace(path)
    code = (
        "import pathlib,sys;"
        f"p=pathlib.Path({target!r});p.parent.mkdir(parents=True,exist_ok=True);"
        "p.write_text(sys.argv[1]);print(f'wrote {p} ({len(sys.argv[1])} bytes)')"
    )
    return await sandbox.run_code(ctx.deps.session_id, code, argv=[content])


async def read_file(ctx: RunContext[Deps], path: str) -> str:
    """Read a file from /workspace in the actor's sandbox."""
    target = _in_workspace(path)
    return await sandbox.run_code(ctx.deps.session_id, f"print(open({target!r}).read())")


async def publish_note(ctx: RunContext[Deps], title: str, body: str) -> str:
    """Publish a note for the whole scope. High consequence: gated on human approval."""
    memory.write_fact(ctx.deps.identity, f"note:{title}", body, scope_path=ctx.deps.identity.scope_path[:-1])
    return f"published {title!r}"


REGISTRY = {f.__name__: f for f in (remember, recall, run_python, run_shell, write_file, read_file, publish_note)}
PROFILES = {
    "journey": ["remember", "recall", "run_python", "run_shell", "write_file", "read_file", "publish_note"],
    "verifier": [],
}
APPROVAL_REQUIRED = {"publish_note"}
# a fact shared wider than one school changes what other people are told: a person decides
WIDE_SCOPES = {"region", "tenant"}


def needs_approval(ctx, tool_def, tool_args) -> bool:
    if tool_def.name in APPROVAL_REQUIRED:
        return True
    return tool_def.name == "remember" and tool_args.get("shared_with") in WIDE_SCOPES


def toolset_for(profile: str):
    names = PROFILES[profile]
    ts = FunctionToolset(tools=[REGISTRY[n] for n in names])
    return ts.approval_required(needs_approval)
