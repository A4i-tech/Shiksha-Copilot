import asyncio
import pathlib
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from pydantic_ai.exceptions import ModelHTTPError

from pydantic_ai import UsageLimits

from . import agent, config, guardrails, journey, memory, runs, sandbox, scheduler
from .deps import Deps
from .identity import Identity, current_identity


@asynccontextmanager
async def lifespan(_: FastAPI):
    agent.setup_tracing()
    memory.init_indexes()
    guardrails.init_indexes()
    runs.init_indexes()
    await sandbox.prefill()
    reaper = asyncio.create_task(sandbox.reaper())
    scheduler.start()
    yield
    reaper.cancel()
    sandbox.shutdown()


api = FastAPI(title="agentic-journey-local", lifespan=lifespan)


@api.exception_handler(ModelHTTPError)
async def model_error(_: Request, exc: ModelHTTPError):
    return JSONResponse(
        status_code=502,
        content={
            "error": f"The model endpoint refused the request (HTTP {exc.status_code}, model {exc.model_name}).",
            "next": "Check OPENAI_BASE_URL, OPENAI_API_KEY and MODEL_NAME in .env, then "
                    "`docker compose restart app`.",
            "detail": str(exc.body),
        },
    )


class ChatIn(BaseModel):
    message: str
    session_id: str | None = None
    # note: no scope field. The server derives scope from the token, never from the caller.


class ApprovalIn(BaseModel):
    approve: bool
    reason: str = ""


@api.post("/chat")
async def chat(body: ChatIn, ident: Identity = Depends(current_identity)):
    return await journey.run_turn(ident, body.message, body.session_id)


@api.get("/approvals")
async def approvals(_: Identity = Depends(current_identity)):
    return guardrails.list_pending()


@api.post("/approvals/{session_id}")
async def decide(session_id: str, body: ApprovalIn, ident: Identity = Depends(current_identity)):
    return await journey.resume_with_approval(ident, session_id, body.approve, body.reason)


@api.get("/memory")
async def show_memory(ident: Identity = Depends(current_identity)):
    return memory.retrieve(ident)


@api.get("/actors")
async def actors():
    """The demo roster, so a person can pick who they are signing in as. No secrets here."""
    from .identity import LEVELS, _TOKENS

    return [
        {
            "token": token,
            "actor_id": ident.actor_id,
            "scope_path": ident.scope_path,
            "scope": dict(zip(LEVELS, ident.scope_path)),
        }
        for token, ident in _TOKENS.items()
    ]


@api.get("/memory/detail")
async def show_memory_detail(ident: Identity = Depends(current_identity)):
    """Every visible fact with the level it came from: mine, my school's, my region's, my tenant's."""
    return {"scope": ident.scope_path, "facts": memory.retrieve_rows(ident)}


@api.get("/config")
async def show_config(_: Identity = Depends(current_identity)):
    """What this instance is pointed at. Never returns the key itself."""
    key = config.OPENAI_API_KEY
    key_set = bool(key) and key not in {"unset", "sk-replace-me"}
    return {
        "provider": agent.provider_name(),
        "endpoint": config.AZURE_OPENAI_ENDPOINT or config.OPENAI_BASE_URL,
        "model": config.MODEL_NAME,
        "model_choices": [m for m in config.MODEL_CHOICES if m],
        "verifier_model": config.VERIFIER_MODEL_NAME,
        "verifier_enabled": config.VERIFIER_ENABLED,
        "fake_model": config.FAKE_MODEL,
        "api_key_set": key_set,
        "api_key_tail": key[-4:] if key_set and len(key) > 8 else "",
    }


@api.post("/admin/model-check")
async def model_check(_: Identity = Depends(current_identity)):
    """One tiny real call, so a key can be checked without guessing from a failed turn."""
    if config.FAKE_MODEL:
        return {"ok": True, "provider": "fake", "note": "FAKE_MODEL=1: no provider was contacted."}
    probe = agent.make_agent("verifier", output_type=str)
    try:
        run = await probe.run(
            "Reply with the single word: ready",
            deps=Deps(Identity("probe", ["org"]), "model-check"),
            usage_limits=UsageLimits(request_limit=1, tool_calls_limit=0),
        )
    except Exception as exc:
        return JSONResponse(
            status_code=502,
            content={
                "ok": False,
                "provider": agent.provider_name(),
                "endpoint": config.AZURE_OPENAI_ENDPOINT or config.OPENAI_BASE_URL,
                "model": config.MODEL_NAME,
                "error": str(exc)[:400],
                "next": "Check OPENAI_API_KEY, OPENAI_BASE_URL (or AZURE_OPENAI_ENDPOINT) and "
                        "MODEL_NAME in .env, then `docker compose up -d app`.",
            },
        )
    return {"ok": True, "provider": agent.provider_name(), "model": config.MODEL_NAME, "reply": str(run.output)[:80]}


@api.get("/usage")
async def usage(_: Identity = Depends(current_identity)):
    """What today has cost so far, by model. Nothing here is an estimate."""
    return runs.usage_totals()


class ModelIn(BaseModel):
    model: str


@api.post("/admin/model")
async def switch_model(body: ModelIn, _: Identity = Depends(current_identity)):
    """Point the journey agent at a different model without a restart.

    Endpoint and key are untouched: this only names a different model on the same provider.
    """
    name = body.model.strip()
    if not name:
        raise HTTPException(400, "Send a model name, for example {\"model\": \"gpt-4.1\"}.")
    config.MODEL_NAME = name
    return {"model": config.MODEL_NAME, "note": "applies to the next turn"}


_LOAD_SAVED: tuple[int, bool] | None = None


class LoadIn(BaseModel):
    sessions: int = 8
    ceiling: int | None = None


@api.post("/admin/simulate-load")
async def simulate_load(body: LoadIn, _: Identity = Depends(current_identity)):
    """Claim N synthetic sandbox sessions in THIS process, so the console shows the fleet move.

    scripts/load_test.py drives the same code in a separate process, which is fine for a
    terminal timeline but invisible to the running app. This is the demo path.
    """
    from . import sandbox

    # remember what to put back: a demo must not leave the service reconfigured
    global _LOAD_SAVED
    if _LOAD_SAVED is None:
        _LOAD_SAVED = (config.SANDBOX_MAX_CONCURRENT, config.SANDBOX_AUTOSCALE)
    if body.ceiling:
        config.SANDBOX_MAX_CONCURRENT = body.ceiling
    config.SANDBOX_AUTOSCALE = True
    claimed = []
    for n in range(max(1, min(body.sessions, 40))):
        sid = f"load-{n}:demo"
        try:
            await sandbox.run_code(sid, "print(1)")
            claimed.append(sid)
        except sandbox.PoolFull as exc:
            return {"claimed": len(claimed), "stopped": str(exc), "pool": sandbox.stats()}
        await asyncio.sleep(0.4)          # paced so the console can be watched
    return {"claimed": len(claimed), "pool": sandbox.stats()}


@api.post("/admin/drain-load")
async def drain_load(_: Identity = Depends(current_identity)):
    """Expire every synthetic session, then let the controller retire the empty pools."""
    from . import sandbox

    global _LOAD_SAVED
    killed = 0
    for pool in sandbox._pools:
        for sid in [s for s in list(pool.bound) if s.startswith("load-")]:
            entry = pool.bound.pop(sid)
            sandbox._locks.pop(sid, None)
            await asyncio.to_thread(sandbox._kill, entry.container)
            killed += 1
    events = []
    for _ in range(6):
        events += await sandbox.autoscale()
        if len([p for p in sandbox._pools if p.accepting]) == 1:
            break
    if _LOAD_SAVED is not None:
        config.SANDBOX_MAX_CONCURRENT, config.SANDBOX_AUTOSCALE = _LOAD_SAVED
        _LOAD_SAVED = None
    return {"released": killed, "scale_events": events,
            "restored_ceiling": config.SANDBOX_MAX_CONCURRENT, "pool": sandbox.stats()}


@api.get("/runs")
async def list_runs(_: Identity = Depends(current_identity)):
    return runs.recent()


@api.get("/ui")
async def ui():
    return FileResponse(pathlib.Path(__file__).with_name("static") / "ui.html")


@api.get("/admin/pool")
async def pool(_: Identity = Depends(current_identity)):
    return sandbox.stats()


@api.get("/healthz")
async def healthz():
    return {"ok": True}
