"""Wipe every piece of demo state: memory, workspaces, run log, sandboxes.

    python scripts/reset.py            # memory + workspaces + run log + sandbox containers
    python scripts/reset.py --memory   # Mongo only, keep workspaces and containers
    python scripts/reset.py --dry-run

Three stores hold state and they expire on different clocks, so clearing one is not clearing
the demo: Mongo holds facts and episodes, MinIO holds the workspace tarballs a session
rehydrates from, and the sandbox containers hold the live tmpfs.
"""
from __future__ import annotations

import argparse
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MONGO_JS = (
    "db.facts.deleteMany({}); db.episodes.deleteMany({}); db.approvals.deleteMany({}); "
    "db.runs.deleteMany({}); db.rate.deleteMany({});"
)
CLEAR_BLOBS = (
    "from app import sandbox, config\n"
    "names = [o.object_name for o in sandbox._blob.list_objects(config.BUCKET)]\n"
    "[sandbox._blob.remove_object(config.BUCKET, n) for n in names]\n"
    "print(len(names))\n"
)


def run(cmd: list[str], dry: bool) -> str:
    if dry:
        print("would run:", " ".join(cmd))
        return ""
    done = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=180)
    if done.returncode != 0:
        print(f"  failed: {done.stderr.strip()[:200]}")
        return ""
    return done.stdout.strip()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--memory", action="store_true", help="Mongo only")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    dry = args.dry_run

    run(["docker", "compose", "exec", "-T", "mongo", "mongosh", "journey", "--quiet",
         "--eval", MONGO_JS], dry)
    print("memory cleared: facts, episodes, approvals, runs, rate counters")

    if args.memory:
        return 0

    out = run(["docker", "compose", "exec", "-T", "app", "python", "-c", CLEAR_BLOBS], dry)
    print(f"workspaces cleared: {out or '0'} tarballs removed from blob storage")

    ids = run(["docker", "ps", "--filter", "label=role=agentic-sandbox", "-q"], dry).split()
    if ids:
        run(["docker", "rm", "-f", *ids], dry)
    print(f"sandboxes removed: {len(ids)} container(s); the pool refills within 30s")

    print("\nDone. The next turn starts from nothing.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
