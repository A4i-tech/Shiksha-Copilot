"""Watch machines come and go as the agent count changes. No model calls, real containers.

    python scripts/load_test.py                 # ramp to 12 sessions, hold, drain
    python scripts/load_test.py --peak 20 --ceiling 4
    python scripts/load_test.py --hold 60

Runs inside the app container, so it drives the pool controller directly rather than through
the model — the question is how the fleet behaves under N concurrent agents, and a model in
the loop would only make that slower and more expensive to observe.

Prints a timeline: sessions, pools, utilisation, and every scale event.
"""
from __future__ import annotations

import argparse
import pathlib
import subprocess
import sys
import textwrap

ROOT = pathlib.Path(__file__).resolve().parent.parent

INNER = '''
import asyncio, time
from app import config, sandbox

PEAK, HOLD, CEILING, COOLDOWN = {peak}, {hold}, {ceiling}, {cooldown}

config.SANDBOX_AUTOSCALE = True
config.SANDBOX_AUTOSIZE = True
config.SANDBOX_MAX_CONCURRENT = CEILING
config.SANDBOX_MAX_POOLS = {max_pools}
config.SANDBOX_COOLDOWN_SECONDS = COOLDOWN
config.SANDBOX_POOL_SIZE = 1

def line(label):
    pools = sandbox._pools
    bound = sum(len(p.bound) for p in pools)
    warm = sum(len(p.warm) for p in pools)
    shape = " ".join(
        f"[{{p.index}}{{'' if p.accepting else '*'}}:{{len(p.bound)}}/{{CEILING}}]" for p in pools)
    print(f"{{label:<26}} sessions={{bound:<3}} pools={{len(pools)}} warm={{warm:<3}} "
          f"util={{sandbox.utilisation():.0%}}  {{shape}}", flush=True)

async def tick():
    """One controller pass: what the reaper does every 30s, run on demand."""
    for ev in await sandbox.autoscale():
        print(f"  scale: {{ev}}", flush=True)
    await sandbox.prefill()

async def main():
    await sandbox.prefill()
    line("start")

    for n in range(PEAK):
        sid = f"load-{{n}}:s"
        await sandbox.run_code(sid, "print(1)")     # a real container, really claimed
        if n % 3 == 2:
            await tick()
            line(f"ramp {{n+1}} agents")
        elif n % 3 == 0:
            line(f"ramp {{n+1}} agents")
    await tick()
    line("peak")

    print(f"  holding {{HOLD}}s so sessions pass their cooldown", flush=True)
    for entry in [e for p in sandbox._pools for e in p.bound.values()]:
        entry.last -= COOLDOWN + 1                  # age them out instead of sleeping for real
    await asyncio.sleep(1)

    now = time.time()
    for pool in sandbox._pools:
        for sid in [s for s, e in pool.bound.items() if sandbox._expired(e, now)]:
            entry = pool.bound.pop(sid)
            sandbox._locks.pop(sid, None)
            await asyncio.to_thread(sandbox._kill, entry.container)
    line("after cooldown")

    for _ in range(6):
        await tick()
        line("drain pass")
        if len(sandbox._pools) == 1:
            break

    print("\\nscale log:", flush=True)
    for ev in sandbox.SCALE_LOG:
        print("  " + ev, flush=True)
    sandbox.shutdown()

asyncio.run(main())
'''


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--peak", type=int, default=12, help="concurrent sessions at the top of the ramp")
    ap.add_argument("--ceiling", type=int, default=4, help="sessions per pool before it is full")
    ap.add_argument("--max-pools", type=int, default=4)
    ap.add_argument("--hold", type=int, default=0, help="seconds to hold at peak (0 = age them out)")
    ap.add_argument("--cooldown", type=int, default=30)
    args = ap.parse_args()

    script = INNER.format(peak=args.peak, hold=args.hold, ceiling=args.ceiling,
                          max_pools=args.max_pools, cooldown=args.cooldown)
    print(textwrap.dedent(f"""\
        Fleet under load: ramping to {args.peak} agents, {args.ceiling} sessions per pool,
        at most {args.max_pools} pools. A pool marked * is retiring: no new placement, keeps
        what it has until those sessions expire.
    """))
    done = subprocess.run(
        ["docker", "compose", "exec", "-T", "app", "python", "-c", script],
        cwd=ROOT, text=True,
    )
    return done.returncode


if __name__ == "__main__":
    sys.exit(main())
