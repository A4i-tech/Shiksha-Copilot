#!/usr/bin/env python3
# Filters infra-ops' kustomize output for kind, points it at locally built images.
import sys

import yaml

SKIP = {"ExternalSecret", "Certificate", "Ingress"}
DEPLOYMENTS = {"shiksha-api", "shiksha-be", "shiksha-fe"}

if len(sys.argv) != 2:
    sys.exit(f"usage: {sys.argv[0]} <tag>")
tag = sys.argv[1]
docs = [d for d in yaml.safe_load_all(sys.stdin) if d and d.get("kind") not in SKIP]
for d in docs:
    if d["kind"] == "Deployment" and d["metadata"]["name"] == "shiksha-fe":
        for c in d["spec"]["template"]["spec"]["containers"]:
            if c["name"] == "shiksha-fe":
                c["image"] = f"shiksha-copilot/frontend:{tag}"
                c["imagePullPolicy"] = "Never"
missing = DEPLOYMENTS - {d["metadata"]["name"] for d in docs if d["kind"] == "Deployment"}
if missing:
    sys.exit(f"infra-ops output is missing deployments: {sorted(missing)}")
yaml.safe_dump_all(docs, sys.stdout)
print(f"kept {len(docs)} resources", file=sys.stderr)
