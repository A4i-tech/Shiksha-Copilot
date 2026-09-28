#!/bin/sh
# Smoke test for render-env.sh's substitution (shared with docker-entrypoint.sh).
# Run: sh test-env-template.sh
set -eu

export MSYS_NO_PATHCONV=1
export BACKEND_URL="/api"
export TURNSTILE_SITE_KEY="test-turnstile-key"

. "$(dirname "$0")/render-env.sh"

tmp_out=$(mktemp)
render_env src/assets/env.template.js "$tmp_out"
out=$(cat "$tmp_out")
rm -f "$tmp_out"

echo "$out" | grep -q '"/api"' || { echo "FAIL: apiUrl not substituted"; exit 1; }
echo "$out" | grep -q '"test-turnstile-key"' || { echo "FAIL: turnstileSiteKey not substituted"; exit 1; }
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

echo "--- checking unsafe characters are rejected ---"
export BACKEND_URL="/api"
for unsafe_val in 'https://example.com/$OTHER_VAR' 'https://example.com/`whoami`'; do
  export TURNSTILE_SITE_KEY="$unsafe_val"
  tmp_out3=$(mktemp)
  if render_env src/assets/env.template.js "$tmp_out3" 2>/tmp/render_env_err; then
    echo "FAIL: render_env should reject value: $unsafe_val"
    rm -f "$tmp_out3"
    exit 1
  fi
  rm -f "$tmp_out3"
done
export TURNSTILE_SITE_KEY="test-turnstile-key"
echo "OK: render_env rejects \$ and backtick in values"
