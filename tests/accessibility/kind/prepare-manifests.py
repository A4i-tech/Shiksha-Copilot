#!/usr/bin/env python3
# Filters infra-ops' kustomize output for kind, points it at locally built images.
import sys

import yaml

SKIP = {"ExternalSecret", "Certificate", "Ingress"}
IMAGES = {"shiksha-api": "api", "shiksha-be": "backend", "shiksha-fe": "frontend"}

tag = sys.argv[1]
docs = [d for d in yaml.safe_load_all(sys.stdin) if d and d.get("kind") not in SKIP]
for d in docs:
    name = d["metadata"]["name"]
    if d["kind"] == "Deployment" and name in IMAGES:
        for c in d["spec"]["template"]["spec"]["containers"]:
            c["image"] = f"shiksha-copilot/{IMAGES[name]}:{tag}"
            c["imagePullPolicy"] = "Never"
missing = set(IMAGES) - {d["metadata"]["name"] for d in docs if d["kind"] == "Deployment"}
if missing:
    sys.exit(f"infra-ops output is missing deployments: {sorted(missing)}")
yaml.safe_dump_all(docs, sys.stdout)
print(f"kept {len(docs)} resources", file=sys.stderr)
