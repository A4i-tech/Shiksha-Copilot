"""Execution plane: warm pools of disposable containers, one bound to one actor session.

The sandbox is a cache of the workspace, never the record. Durable state lives in
memory (Mongo) and blob storage (MinIO), so a lost sandbox costs one rehydration.
"""
import asyncio
import io
import math
import socket as socket_module
import uuid
import zlib
import time
from collections import deque
from dataclasses import dataclass, field

import docker
from minio import Minio

from . import config

_docker = docker.from_env()
_blob = Minio(
    config.MINIO_ENDPOINT,
    access_key=config.MINIO_ACCESS_KEY,
    secret_key=config.MINIO_SECRET_KEY,
    secure=False,
)

# runtimes that put a kernel boundary between the sandbox and the host
VM_RUNTIMES = {"runsc", "runsc-kvm", "kata", "kata-runtime", "kata-qemu"}


class PoolFull(Exception):
    """Every session slot in the actor's pool is taken."""


@dataclass
class Entry:
    container: object
    last: float
    created: float


@dataclass
class Pool:
    index: int
    warm: list = field(default_factory=list)
    bound: dict[str, Entry] = field(default_factory=dict)
    accepting: bool = True   # a retiring pool takes no new placement, keeps what it has

    @property
    def retiring(self) -> bool:
        return not self.accepting


_pools: list[Pool] = [Pool(i) for i in range(config.SANDBOX_POOL_COUNT)]
_start_latency = config.SANDBOX_ASSUMED_START_SECONDS  # EWMA, seconds
_claims: deque[float] = deque(maxlen=500)
SCALE_LOG: deque[str] = deque(maxlen=50)
# One workspace per session, so one command at a time in it. A model may issue tool calls
# concurrently, and a read that overtakes its own write reports a file that does exist as missing.
_locks: dict[str, asyncio.Lock] = {}


def _lock_for(session_id: str) -> asyncio.Lock:
    return _locks.setdefault(session_id, asyncio.Lock())


def actor_of(session_id: str) -> str:
    return session_id.split(":", 1)[0]


def _pool_holding(session_id: str) -> Pool | None:
    return next((p for p in _pools if session_id in p.bound), None)


def pool_for(session_id: str) -> Pool:
    """Placement rule. An actor always lands in the same pool, so its sessions share a ceiling.

    A session already bound stays where it is, whatever the pool count is now. Scaling changes
    where NEW work lands and never moves running work — the controller rehydrates, it does not
    migrate, which is the whole reason pool count can be a scaling decision at all.

    crc32, not hash(): str hashing is salted per process, so hash() would remap every actor
    to a different pool on each restart.
    """
    held = _pool_holding(session_id)
    if held is not None:
        return held
    open_pools = [p for p in _pools if p.accepting] or _pools
    preferred = open_pools[zlib.crc32(actor_of(session_id).encode()) % len(open_pools)]
    if len(preferred.bound) < config.SANDBOX_MAX_CONCURRENT:
        return preferred
    # affinity is a preference, not a cage: a full pool spills to the emptiest one with room,
    # otherwise adding capacity would not help an actor whose hash keeps pointing at the full one
    with_room = [p for p in open_pools if len(p.bound) < config.SANDBOX_MAX_CONCURRENT]
    return min(with_room, key=lambda p: len(p.bound)) if with_room else preferred


def vm_boundary() -> bool:
    return config.SANDBOX_RUNTIME in VM_RUNTIMES


# --- container lifecycle ----------------------------------------------------


def _run_kwargs(network: str) -> dict:
    kwargs = dict(
        detach=True,
        network_mode=network,
        read_only=True,               # writes confined to the tmpfs paths below
        tmpfs={"/workspace": "", "/tmp": ""},
        mem_limit=config.SANDBOX_MEM_LIMIT,
        pids_limit=128,
        environment={},               # no credentials cross the trust boundary
        labels={"role": "agentic-sandbox"},
        auto_remove=False,
    )
    if config.SANDBOX_RUNTIME:
        kwargs["runtime"] = config.SANDBOX_RUNTIME
    return kwargs


def _safe_name(session_id: str) -> str:
    """A container name a person can recognize in Docker Desktop. Session ids carry ':'."""
    stem = "".join(c if c.isalnum() or c in "-_" else "-" for c in session_id)[:40].strip("-")
    return f"sbx-{stem or 'warm'}-{uuid.uuid4().hex[:4]}"


def _start_container(session_id: str = "warm"):
    """Two phases, as the design doc requires: setup may reach the network, the agent may not."""
    global _start_latency
    began = time.monotonic()
    setup = config.SANDBOX_SETUP_CMD.strip()
    network = config.SANDBOX_SETUP_NETWORK if setup else "none"
    container = _docker.containers.run(
        config.SANDBOX_IMAGE, ["sleep", "infinity"], name=_safe_name(session_id), **_run_kwargs(network))
    if setup:
        container.exec_run(["sh", "-lc", setup], workdir="/workspace")
        _revoke_network(container)    # agent phase: egress gone for the rest of its life
    _start_latency = 0.7 * _start_latency + 0.3 * (time.monotonic() - began)
    return container


def _revoke_network(container) -> None:
    container.reload()
    for name in container.attrs["NetworkSettings"]["Networks"]:
        try:
            _docker.networks.get(name).disconnect(container, force=True)
        except Exception:
            pass


def has_egress(container) -> bool:
    container.reload()
    return bool(container.attrs["NetworkSettings"]["Networks"])


def _kill(container) -> None:
    try:
        container.remove(force=True)
    except Exception:
        pass


# --- workspace, which outlives the container --------------------------------

_TAR = (
    "import tarfile,sys;"
    "t=tarfile.open(fileobj=sys.stdout.buffer, mode='w|');"
    "t.add('/workspace', arcname='workspace');t.close()"
)
_UNTAR = "import tarfile,sys;tarfile.open(fileobj=sys.stdin.buffer, mode='r|').extractall('/')"


def _ensure_bucket() -> None:
    if not _blob.bucket_exists(config.BUCKET):
        _blob.make_bucket(config.BUCKET)


def _snapshot(pool: Pool, session_id: str) -> str:
    """Taken from inside: get_archive sees only the mount point, not the tmpfs contents."""
    stdout, _ = pool.bound[session_id].container.exec_run(["python", "-c", _TAR], demux=True).output
    key = f"{session_id}.tar"
    _blob.put_object(config.BUCKET, key, io.BytesIO(stdout), len(stdout))
    return key


def _restore(container, session_id: str) -> None:
    """put_archive is refused on a read-only rootfs, so the container untars its own workspace."""
    try:
        obj = _blob.get_object(config.BUCKET, f"{session_id}.tar")
        data = obj.read()
    except Exception:
        return  # first turn of a session: nothing to restore
    finally:
        try:
            obj.close()
            obj.release_conn()
        except Exception:
            pass
    api = _docker.api
    exec_id = api.exec_create(container.id, ["python", "-c", _UNTAR], stdin=True)["Id"]
    sock = api.exec_start(exec_id, socket=True)
    raw = getattr(sock, "_sock", sock)
    try:
        raw.sendall(data)
        raw.shutdown(socket_module.SHUT_WR)
        while raw.recv(4096):
            pass
    finally:
        raw.close()


# --- claim and execute ------------------------------------------------------


def capacity_check(session_id: str) -> None:
    """Raise before any work starts when the actor's pool has no session slot left.

    Under autoscale a full pool is a reason to add one, not to refuse: waiting for the 30s
    controller tick would turn a burst into 503s while the capacity is already allowed.
    """
    pool = pool_for(session_id)
    if session_id in pool.bound:
        return
    if (
        len(pool.bound) >= config.SANDBOX_MAX_CONCURRENT
        and config.SANDBOX_AUTOSCALE
        and len(_pools) < config.SANDBOX_MAX_POOLS
    ):
        grown = Pool(index=max((p.index for p in _pools), default=-1) + 1)
        _pools.append(grown)
        SCALE_LOG.append(f"pool {grown.index} started on demand (pool {pool.index} was full)")
        pool = pool_for(session_id)
    if len(pool.bound) >= config.SANDBOX_MAX_CONCURRENT:
        raise PoolFull(
            f"Sandbox pool {pool.index} is at its ceiling of {config.SANDBOX_MAX_CONCURRENT} "
            "concurrent sessions. Wait for a session to reach its cooldown, or raise "
            "SANDBOX_MAX_CONCURRENT / SANDBOX_POOL_COUNT in .env."
        )


def _claim(session_id: str):
    pool = pool_for(session_id)
    entry = pool.bound.get(session_id)
    if entry is not None:
        try:
            entry.container.reload()
            if entry.container.status == "running":
                entry.last = time.time()
                return entry.container
        except docker.errors.NotFound:
            pass  # host fault or manual removal: rehydrate below
    capacity_check(session_id)
    _claims.append(time.time())
    container = _take_warm(pool) or _start_container(session_id)
    _restore(container, session_id)
    now = time.time()
    pool.bound[session_id] = Entry(container, now, now)
    return container


def _take_warm(pool: Pool):
    """Skip containers removed behind our back, so a stale entry never reaches an actor."""
    while pool.warm:
        candidate = pool.warm.pop()
        try:
            candidate.reload()
            if candidate.status == "running":
                return candidate
        except docker.errors.NotFound:
            continue
    return None


def _exec(session_id: str, argv: list[str], code: str, extra: list[str] | None = None) -> str:
    pool = pool_for(session_id)
    container = _claim(session_id)
    res = container.exec_run(
        argv + [code] + (extra or []),
        workdir="/workspace",
        environment={"PYTHONPATH": "/workspace/libs"},  # where the setup phase installs
        demux=False,
    )
    _snapshot(pool, session_id)
    out = res.output.decode(errors="replace").strip()
    return f"exit {res.exit_code}: {out}" if res.exit_code != 0 else out


async def run_code(session_id: str, code: str, argv: list[str] | None = None) -> str:
    async with _lock_for(session_id):
        return await asyncio.to_thread(_exec, session_id, ["python", "-c"], code, argv)


async def run_shell(session_id: str, command: str) -> str:
    async with _lock_for(session_id):
        return await asyncio.to_thread(_exec, session_id, ["sh", "-lc"], command)


# --- pool maintenance -------------------------------------------------------


def arrival_rate_per_second(window: float = 300.0) -> float:
    cutoff = time.time() - window
    recent = [t for t in _claims if t >= cutoff]
    return len(recent) / window if recent else 0.0


def littles_law_depth() -> int:
    """Pool depth = arrival rate x start latency, plus one so an empty pool is never the norm."""
    return max(config.SANDBOX_POOL_SIZE, math.ceil(arrival_rate_per_second() * _start_latency) + 1)


def warm_target() -> int:
    if not config.SANDBOX_AUTOSIZE:
        return config.SANDBOX_POOL_SIZE
    return min(littles_law_depth(), config.SANDBOX_POOL_MAX)


def utilisation() -> float:
    """Bound sessions over the capacity of the pools still accepting work."""
    open_pools = [p for p in _pools if p.accepting]
    ceiling = max(1, len(open_pools) * config.SANDBOX_MAX_CONCURRENT)
    return sum(len(p.bound) for p in open_pools) / ceiling


def scale_decision() -> str | None:
    """out, in, or nothing. Kept pure so it can be tested without starting a container."""
    if not config.SANDBOX_AUTOSCALE:
        return None
    open_pools = [p for p in _pools if p.accepting]
    if utilisation() >= config.SANDBOX_SCALE_OUT_AT and len(_pools) < config.SANDBOX_MAX_POOLS:
        return "out"
    if utilisation() <= config.SANDBOX_SCALE_IN_AT and len(open_pools) > 1:
        return "in"
    return None


def _retire_candidate() -> Pool | None:
    """The emptiest accepting pool, newest first on a tie — shed the machine added last.

    Retiring strands nobody: the pool keeps its sessions until they expire or rehydrate.
    """
    open_pools = [p for p in _pools if p.accepting]
    return min(open_pools, key=lambda p: (len(p.bound), -p.index)) if len(open_pools) > 1 else None


async def autoscale() -> list[str]:
    """Add a pool under pressure; retire one when demand drains. Never moves a live session."""
    events: list[str] = []
    move = scale_decision()
    if move == "out":
        pool = Pool(index=max((p.index for p in _pools), default=-1) + 1)
        _pools.append(pool)
        events.append(f"pool {pool.index} started (utilisation {utilisation():.0%})")
    elif move == "in":
        victim = _retire_candidate()
        if victim is not None:
            victim.accepting = False
            events.append(f"pool {victim.index} retiring, {len(victim.bound)} session(s) to drain")

    # a retired pool disappears only once the last session has expired or rehydrated elsewhere
    for pool in [p for p in _pools if p.retiring and not p.bound]:
        for container in pool.warm:
            await asyncio.to_thread(_kill, container)
        pool.warm.clear()
        _pools.remove(pool)
        events.append(f"pool {pool.index} stopped")
    return events


async def prefill() -> None:
    def _fill():
        _ensure_bucket()
        try:
            _docker.images.get(config.SANDBOX_IMAGE)
        except docker.errors.ImageNotFound:
            _docker.images.pull(config.SANDBOX_IMAGE)
        target = warm_target()
        for pool in _pools:
            if pool.retiring:
                continue  # nothing new goes into a pool on its way out
            while len(pool.warm) < target:
                pool.warm.append(_start_container())

    await asyncio.to_thread(_fill)


def _expired(entry: Entry, now: float) -> str | None:
    if now - entry.last > config.SANDBOX_COOLDOWN_SECONDS:
        return "idle past cooldown"
    if now - entry.created > config.SANDBOX_MAX_LIFETIME_SECONDS:
        return "reached max session lifetime"
    return None


async def reaper() -> None:
    """Cooldown and a hard lifetime cap, the two limits Container Apps sessions also impose."""
    while True:
        await asyncio.sleep(30)
        now = time.time()
        for pool in _pools:
            for sid in [s for s, e in pool.bound.items() if _expired(e, now)]:
                entry = pool.bound.pop(sid)
                _locks.pop(sid, None)
                await asyncio.to_thread(_kill, entry.container)
        await prefill()


def shutdown() -> None:
    for pool in _pools:
        for c in pool.warm:
            _kill(c)
        pool.warm.clear()
        for entry in pool.bound.values():
            _kill(entry.container)
        pool.bound.clear()


def stats() -> dict:
    now = time.time()
    return {
        "pools": [
            {
                "index": p.index,
                "warm": len(p.warm),
                "bound": list(p.bound),
                "ages_seconds": {s: round(now - e.created) for s, e in p.bound.items()},
                "accepting": p.accepting,
            }
            for p in _pools
        ],
        "warm": sum(len(p.warm) for p in _pools),
        "bound": [s for p in _pools for s in p.bound],
        "pool_size": config.SANDBOX_POOL_SIZE,
        "pool_count": len(_pools),
        "max_concurrent_per_pool": config.SANDBOX_MAX_CONCURRENT,
        "cooldown_seconds": config.SANDBOX_COOLDOWN_SECONDS,
        "max_lifetime_seconds": config.SANDBOX_MAX_LIFETIME_SECONDS,
        "start_latency_ms": round(_start_latency * 1000),
        "arrival_rate_per_min": round(arrival_rate_per_second() * 60, 2),
        "littles_law_depth": littles_law_depth(),
        "warm_target": warm_target(),
        "autosize": config.SANDBOX_AUTOSIZE,
        "autoscale": config.SANDBOX_AUTOSCALE,
        "max_pools": config.SANDBOX_MAX_POOLS,
        "utilisation": round(utilisation(), 3),
        "scale_events": list(SCALE_LOG)[-8:],
        "runtime": config.SANDBOX_RUNTIME or "default (docker, shared kernel)",
        "vm_boundary": vm_boundary(),
        "setup_phase": bool(config.SANDBOX_SETUP_CMD.strip()),
    }
