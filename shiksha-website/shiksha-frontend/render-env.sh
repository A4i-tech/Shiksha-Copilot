#!/bin/sh
# Shared by docker-entrypoint.sh and test-env-template.sh.
render_env() {
  template_path="$1"
  output_path="$2"

  for var in BACKEND_URL TURNSTILE_SITE_KEY SUPERSET_URL SUPERSET_DASHBOARD_UUID SUPERSET_MOBILE_DASHBOARD_UUID; do
    eval "val=\${$var:-}"
    if [ -z "$val" ]; then
      echo "::error::$var is required and was not set" >&2
      return 1
    fi
    # Value lands inside a JS string literal and a sed s|..| expression.
    case "$val" in
      *'"'*|*'|'*|*'\'*|*'<'*|*'&'*)
        echo "::error::$var contains a character that cannot be templated safely (\" | \\ < &)" >&2
        return 1
        ;;
    esac
  done

  sed \
    -e "s|\${BACKEND_URL}|${BACKEND_URL}|g" \
    -e "s|\${TURNSTILE_SITE_KEY}|${TURNSTILE_SITE_KEY}|g" \
    -e "s|\${SUPERSET_URL}|${SUPERSET_URL}|g" \
    -e "s|\${SUPERSET_DASHBOARD_UUID}|${SUPERSET_DASHBOARD_UUID}|g" \
    -e "s|\${SUPERSET_MOBILE_DASHBOARD_UUID}|${SUPERSET_MOBILE_DASHBOARD_UUID}|g" \
    "$template_path" > "$output_path"

  # GitHub Pages serves everything with a fixed max-age=600 and allows no
  # header overrides, so the URL itself has to change when the config does.
  index_path="$(dirname "$(dirname "$output_path")")/index.html"
  if [ -f "$index_path" ]; then
    env_hash=$(md5sum "$output_path" | cut -c1-8)
    sed -i "s|assets/env\.js[^\"]*|assets/env.js?v=$env_hash|g" "$index_path"
  fi
}
