#!/bin/sh
# Renders env.template.js into env.js from this container's env vars.
set -eu

. "$(dirname "$0")/render-env.sh"
render_env /srv/assets/env.template.js /srv/assets/env.js

exec "$@"
