#!/bin/sh
# Smoke test for render-env.sh's substitution (shared with docker-entrypoint.sh).
# Run: sh test-env-template.sh
set -eu

export MSYS_NO_PATHCONV=1
export BACKEND_URL="/api"
export TURNSTILE_SITE_KEY="test-turnstile-key"
export SUPERSET_URL="https://superset.example.com"
export SUPERSET_DASHBOARD_UUID="uuid-desktop"
export SUPERSET_MOBILE_DASHBOARD_UUID="uuid-mobile"

. "$(dirname "$0")/render-env.sh"

tmp_out=$(mktemp)
render_env src/assets/env.template.js "$tmp_out"
out=$(cat "$tmp_out")
rm -f "$tmp_out"

echo "$out" | grep -q '"/api"' || { echo "FAIL: apiUrl not substituted"; exit 1; }
echo "$out" | grep -q '"test-turnstile-key"' || { echo "FAIL: turnstileSiteKey not substituted"; exit 1; }
echo "$out" | grep -q '"https://superset.example.com"' || { echo "FAIL: supersetUrl not substituted"; exit 1; }
echo "$out" | grep -q '"uuid-desktop"' || { echo "FAIL: supersetDashboardUuid not substituted"; exit 1; }
echo "$out" | grep -q '"uuid-mobile"' || { echo "FAIL: supersetMobileDashboardUuid not substituted"; exit 1; }
echo "$out" | grep -q '\${' && { echo "FAIL: leftover \${...} placeholder"; exit 1; }

echo "OK: env.template.js substitutes cleanly via render_env"

echo "--- checking BACKEND_URL is required ---"
unset BACKEND_URL
tmp_out2=$(mktemp)
if render_env src/assets/env.template.js "$tmp_out2" 2>/tmp/render_env_err; then
  echo "FAIL: render_env should have failed with BACKEND_URL unset"
  rm -f "$tmp_out2"
  exit 1
fi
rm -f "$tmp_out2"
echo "OK: render_env fails loud when BACKEND_URL is unset"
