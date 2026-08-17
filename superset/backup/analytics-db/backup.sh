# pipefail required: without it, `set -eu` only checks the LAST command in
# the pg_dump | restic pipe. A failed/truncated pg_dump would still let
# restic exit 0 and print "Success" on an empty or corrupt backup.
set -euo pipefail

echo "--- analytics-db Daily Backup ---"

echo "Initializing Restic Repo: $RESTIC_REPOSITORY"
restic init || echo "Repo already exists"

echo "Streaming pg_dump..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
  --host="$PGHOST" --username="$PGUSER" --dbname="$PGDATABASE" --format=custom | \
  restic backup --stdin --stdin-filename "analytics-db-$(date +%Y%m%d).dump" --tag "daily"

echo "Pruning old snapshots (keep last 14 daily)..."
restic forget --keep-daily 14 --prune

echo "--- Success ---"
