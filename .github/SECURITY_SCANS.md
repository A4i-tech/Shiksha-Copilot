# Security scans on this repo

Semgrep runs on every pull request into `a4i/staging`. CodeQL already runs weekly plus on push/PR into `main` (`.github/workflows/codeql.yml`), unchanged by this addition.

| Tool | Role | Blocks merge? | Where results show |
|------|------|---------------|--------------------|
| Semgrep | Primary gate. Fast pattern + light dataflow, OSS engine. Rulesets `p/security-audit`, `p/owasp-top-ten`. | **Yes**, once the ruleset requires it (see below). A new `ERROR`-severity finding fails the check. | PR **Checks** + Security > Code scanning |
| CodeQL | Depth layer, already running on this repo. | No. Advisory. | Security > Code scanning |

## Why the gate stays low-noise

- **Diff-aware.** Only findings introduced by the PR are scanned (`--baseline-commit`). Pre-existing findings are not evaluated by the gate. The backlog is tracked in issue #575.
- **Severity gate.** Only `ERROR` (high/critical) can block the PR's own diff. The full-repo advisory step also reports `WARNING`/`ERROR` for the pre-existing backlog in the run summary (see below); it never fails the check.

## Suppressing a false positive

1. **One line** — add on the flagged line:

   ```python
   subprocess.run(cmd, shell=True)  # nosemgrep: dangerous-subprocess-use  cmd is a fixed constant
   ```

   Always name the rule id and say why it is safe.

2. **A whole path** (generated code, vendored deps, test fixtures) — add it to `.semgrepignore` with a one-line reason.

3. **A rule wrong for this codebase every time** — add `--exclude-rule <rule-id>` to the scan step in `.github/workflows/semgrep.yml`, with a comment, after agreeing it with the security owner.

For CodeQL: dismiss the alert in the Security tab with a reason, or add the path to the query config.

## Known pre-existing findings (not fixed by this PR)

A full scan at the time this gate lands reports 97 findings (11 `ERROR`, 86 `WARNING`). The diff-aware gate does **not** block on any of these, it only evaluates lines a PR actually changes:

- `yaml.github-actions.security.secrets-inherit`, 5 hits in `.github/workflows/main.yaml` (reusable-workflow `secrets: inherit` pattern)
- `yaml.github-actions.security.run-shell-injection`, 4 hits across `.github/actions/*/action.yml`, `.github/workflows/cicd-frontend.yaml`, `deploy-azure-webapp.yml`, `main.yaml`
- `yaml.github-actions.security.gha-curl-pipe-shell`, 1 hit, `.github/workflows/ci-api.yaml` (`curl | python3` Poetry install)
- `javascript.node-crypto.security.gcm-no-tag-length`, 1 hit, `shiksha-website/shiksha-backend/routes/presentation.routes.js`
- `python.fastapi.security.wildcard-cors`, 1 hit (`WARNING`, treated as critical given the prior SEEDS CORS outage), `shiksha-api/app-service/app/main.py`
- `javascript.express.security.audit.xss.direct-response-write`, 1 hit, `shiksha-website/shiksha-backend/routes/presentation.routes.js`
- `python.lang.security.audit.logging.logger-credential-leak`, 10 hits (2 real, in `shiksha-ingestion/pipeline_steps/step_5_*.py` and `step_7_*.py`; 8 are test files logging token *counts*, not credentials, false positive)
- `typescript.angular.security.audit.angular-domsanitizer.angular-bypasssecuritytrust`, 2 hits, `utility.service.ts` and `chatbot.component.ts`
- `yaml.github-actions.security.github-actions-mutable-action-tag`, 69 hits, parked for a separate ticket (pin every `uses:` to a commit SHA, large mechanical change)

A companion PR addresses the first 8 categories (the 9th is parked per issue #575). Triage for anything still open belongs to issue #575.

## Making the gate enforceable

A repo admin must add a branch protection rule for `a4i/staging` (it currently has none) and mark **`semgrep`** (shown as *Semgrep / semgrep* in PR checks) as a required status check, after watching the false-positive rate for about a week.

Until then the check runs and shows red on a finding, but does not stop a merge.

## Not covered yet

- Kotlin / Android, if any — not present in this repo.
- Trivy, osv-scanner, Dependabot, DAST — later phases in the SAST/DAST rollout plan.

## Local run

Same scan a reviewer can run before pushing, fully sandboxed (no host install):

```bash
docker run --rm -v "$PWD":/src:ro -w /src semgrep/semgrep:1.179.0 \
  semgrep scan --config p/security-audit --config p/owasp-top-ten \
  --severity ERROR --oss-only --metrics off
```

Drop `--severity ERROR` to also see `WARNING` / `INFO`.
