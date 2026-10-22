#!/usr/bin/env node
/**
 * Accessibility scanner using Playwright + axe-core.
 * Logs in via OTP then scans all post-login pages.
 * Usage:  node tests/accessibility/run-accessibility.js
 * Output: tests/accessibility/results/accessibility-report-<timestamp>.json + .html
 *
 * Env vars:
 *   FRONTEND_URL        - base URL (required — no fallback, avoids scanning the wrong frontend)
 *   TEST_USER_PHONE     - teacher/standard user phone for OTP login
 *   TEST_USER_OTP       - 4-digit OTP for teacher user
 *   TEST_ADMIN_PHONE    - admin/manager phone (optional — enables admin route scanning)
 *   TEST_ADMIN_OTP      - 4-digit OTP for admin user
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
const TEST_USER_PHONE = process.env.TEST_USER_PHONE;
const TEST_USER_OTP = process.env.TEST_USER_OTP;
const TEST_ADMIN_PHONE = process.env.TEST_ADMIN_PHONE;
const TEST_ADMIN_OTP = process.env.TEST_ADMIN_OTP;
const OUT_DIR = path.join(process.cwd(), 'tests', 'accessibility', 'results');

// Fraction of axe rules a page must pass before the check is considered failing.
const SCORE_THRESHOLD = 0.90;

// Routes are flat (no /user or /admin prefix) — see view-routing.module.ts,
// which mounts both UserModule and AdminModule at path ''.
const USER_URL_PATHS = [
  '/#/home',
  '/#/profile',
  '/#/chatbot',
  '/#/help',
  '/#/generation-status',
  '/#/content-generation',
  '/#/content-generation/lesson-resources',
  '/#/content-generation/lesson-plan',
  '/#/content-generation/presentation',
  '/#/content-generation/lesson-chat',
  '/#/content-generation/inspect/lesson-plan',
  '/#/content-generation/inspect/resource',
  '/#/question-paper',
  '/#/question-paper/generate',
  '/#/schedule',
];

const ADMIN_URL_PATHS = [
  '/#/dashboard',
  '/#/content-activity',
  '/#/audit-log',
  '/#/school-management/list',
  '/#/school-management/add',
  '/#/teacher-management/list',
  '/#/teacher-management/add',
  '/#/staff-management/list',
  '/#/staff-management/add',
  '/#/teacher-training/view-batch',
  '/#/teacher-training/create-batch',
];

async function performLogin(page, phone, otp) {
  await page.goto(`${FRONTEND_URL}/#/auth/signin`);
  await page.locator('#mNumber').waitFor({ state: 'visible' });
  await page.locator('#mNumber').fill(phone);
  await page.getByRole('button', { name: 'Continue' }).click();
  // ng-otp-input needs per-cell fill + input event to trigger Angular CD
  const otpInputs = page.locator('input.otp-input');
  await otpInputs.first().waitFor({ state: 'visible', timeout: 15000 });
  for (let i = 0; i < otp.length; i++) {
    const cell = otpInputs.nth(i);
    await cell.focus();
    await cell.fill(otp[i]);
    await cell.dispatchEvent('input');
  }
  const verifyBtn = page.getByRole('button', { name: 'Verify' });
  await verifyBtn.waitFor({ state: 'visible', timeout: 15000 });
  await verifyBtn.dispatchEvent('click');
  await page.waitForURL('**/#/**', { timeout: 20000 });
}

async function dismissModals(page) {
  // Dismiss baseline survey dialog if visible (guard opens it async after navigation)
  try {
    const cancelBtn = page.locator('button.btn-cancel').first();
    if (await cancelBtn.isVisible({ timeout: 1500 })) {
      await cancelBtn.click();
      await page.locator('mat-dialog-container').waitFor({ state: 'hidden', timeout: 3000 });
    }
  } catch {
    // no modal — continue
  }
  // Dismiss delete-confirmation dialog if a stray click opened one (see app-delete-detail)
  try {
    const deleteDialog = page.locator('[aria-labelledby="delete-dialog-title"]').first();
    if (await deleteDialog.isVisible({ timeout: 1000 })) {
      await page.keyboard.press('Escape');
      await deleteDialog.waitFor({ state: 'hidden', timeout: 3000 });
    }
  } catch {
    // no modal — continue
  }
}

async function scanUrl(page, url) {
  console.log(`  Scanning: ${url}`);
  await page.goto(url);
  // Wait for domcontentloaded, then attempt networkidle with a short timeout.
  // Some pages (e.g. question-paper list) make slow backend calls that keep
  // the network busy; falling back avoids hard failures on those pages.
  try {
    await page.waitForLoadState('networkidle', { timeout: 12000 });
  } catch {
    console.log(`    (networkidle timed out — continuing with domcontentloaded)`);
  }
  await dismissModals(page);
  await page.addScriptTag({ path: require.resolve('axe-core') });
  return page.evaluate(() => window.axe.run());
}

/**
 * Discovers real detail-page URLs by navigating list pages and clicking items.
 * Returns a map: { 'lesson-plan': url, 'resource-plan': url, 'draft': url,
 *                  'presentation': url, 'question-paper-view': url }
 * Any type with no existing items is omitted.
 */
async function discoverDetailUrls(page) {
  const found = {};

  // --- Content generation list ---
  const cgListUrl = `${FRONTEND_URL}/#/content-generation`;
  await page.goto(cgListUrl);
  try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch {}
  await dismissModals(page);

  // Exclude delete/chatbot buttons (they have a `title` attr, don't navigate) —
  // only the primary view/edit button per card should be clicked here.
  const cardButtonSelector = '.card button:not([title])';
  const cardButtons = page.locator(cardButtonSelector);
  const cardCount = await cardButtons.count();
  console.log(`  Found ${cardCount} content-generation cards`);

  for (let i = 0; i < Math.min(cardCount, 30); i++) {
    if (found['lesson-plan'] && found['resource-plan'] && found['presentation'] && found['draft']) break;

    // Re-fetch list on each iteration since clicking navigates away
    await page.goto(cgListUrl);
    try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch {}
    await dismissModals(page);

    const btn = page.locator(cardButtonSelector).nth(i);
    if (!await btn.isVisible({ timeout: 2000 }).catch(() => false)) continue;

    const prevUrl = page.url();
    try {
      await btn.click({ timeout: 10000 });
    } catch { await dismissModals(page); continue; }
    try {
      await page.waitForURL(u => u !== prevUrl, { timeout: 8000 });
    } catch { await dismissModals(page); continue; }

    const url = page.url();
    if (url.includes('/lesson-plan/') && !url.includes('/draft/') && !found['lesson-plan']) {
      found['lesson-plan'] = url;
      console.log(`  Discovered lesson-plan detail: ${url}`);
    } else if (url.includes('/resource-plan/') && !url.includes('/draft/') && !found['resource-plan']) {
      found['resource-plan'] = url;
      console.log(`  Discovered resource-plan detail: ${url}`);
    } else if (url.match(/\/presentation\/[^/]+$/) && !found['presentation']) {
      found['presentation'] = url;
      console.log(`  Discovered presentation detail: ${url}`);
    } else if (url.includes('/draft/') && !found['draft']) {
      found['draft'] = url;
      console.log(`  Discovered draft detail: ${url}`);
    }
  }

  // --- Question bank list ---
  const qbListUrl = `${FRONTEND_URL}/#/question-paper`;
  await page.goto(qbListUrl);
  try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch {}
  await dismissModals(page);

  const qbBtn = page.locator('.card button').first();
  if (await qbBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    const prevUrl = page.url();
    await qbBtn.click();
    try {
      await page.waitForURL(u => u !== prevUrl, { timeout: 8000 });
      found['question-paper-view'] = page.url();
      console.log(`  Discovered question-paper view: ${page.url()}`);
    } catch {}
  }

  return found;
}

function buildRunReport(axeResult, url) {
  const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  const issueCounts = { critical: 0, serious: 0, moderate: 0, minor: 0, unknown: 0 };

  const failingAudits = axeResult.violations.map(v => {
    const impact = v.impact || 'unknown';
    const count = v.nodes.length;
    issueCounts[impact] = (issueCounts[impact] ?? 0) + count;
    return {
      id: v.id,
      title: v.help,
      description: v.description,
      impact,
      wcagTags: v.tags.filter(t => t.startsWith('wcag') || t.startsWith('best-practice')),
      helpUrl: v.helpUrl,
      affectedElementCount: count,
      affectedElements: v.nodes.map(n => ({
        selector: Array.isArray(n.target) ? n.target.join(' ') : String(n.target),
        snippet: n.html || '',
        nodeLabel: n.failureSummary || '',
        relatedNodes: (n.any || []).flatMap(c => c.relatedNodes || []).map(r => ({
          selector: Array.isArray(r.target) ? r.target.join(' ') : String(r.target),
          snippet: r.html || '',
          nodeLabel: '',
        })),
      })),
    };
  });

  failingAudits.sort((a, b) =>
    (impactOrder[a.impact] ?? 4) - (impactOrder[b.impact] ?? 4) ||
    b.affectedElementCount - a.affectedElementCount
  );

  const totalIssues = Object.values(issueCounts).reduce((s, v) => s + v, 0);
  const passCount = axeResult.passes.length;
  const totalRules = passCount + axeResult.violations.length;
  const score = totalRules > 0 ? passCount / totalRules : 1;

  return {
    url,
    fetchTime: new Date().toISOString(),
    axeCoreVersion: axeResult.testEngine?.version || null,
    score,
    summary: { totalIssues, ...issueCounts },
    failingAudits,
    passingAudits: axeResult.passes.map(p => ({
      id: p.id,
      title: p.help,
      wcagTags: p.tags.filter(t => t.startsWith('wcag') || t.startsWith('best-practice')),
    })),
    incompleteCount: axeResult.incomplete.length,
  };
}

// --- main ---

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!FRONTEND_URL) {
    console.error('ERROR: FRONTEND_URL must be set (no fallback — prevents scanning the wrong frontend)');
    process.exit(1);
  }

  if (!TEST_USER_PHONE || !TEST_USER_OTP) {
    console.error('ERROR: TEST_USER_PHONE and TEST_USER_OTP must be set');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true });
  let runs = [];
  let overallPassed = true;

  async function scanAdminPaths() {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      console.log(`\nLogging in as admin...`);
      await performLogin(page, TEST_ADMIN_PHONE, TEST_ADMIN_OTP);
      console.log(`Login successful. Scanning ${ADMIN_URL_PATHS.length} admin URLs...`);
      for (const urlPath of ADMIN_URL_PATHS) {
        const fullUrl = `${FRONTEND_URL}${urlPath}`;
        try {
          const axeResult = await scanUrl(page, fullUrl);
          runs.push(buildRunReport(axeResult, fullUrl));
        } catch (err) {
          console.log(`  FAILED: ${fullUrl} — ${err.message}`);
          overallPassed = false;
        }
      }
    } finally {
      await context.close();
    }
  }

  async function scanUserPaths() {
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      console.log(`\nLogging in as user...`);
      await performLogin(page, TEST_USER_PHONE, TEST_USER_OTP);
      console.log(`Login successful. Scanning ${USER_URL_PATHS.length} user URLs...`);

      for (const urlPath of USER_URL_PATHS) {
        const fullUrl = `${FRONTEND_URL}${urlPath}`;
        try {
          const axeResult = await scanUrl(page, fullUrl);
          runs.push(buildRunReport(axeResult, fullUrl));
        } catch (err) {
          console.log(`  FAILED: ${fullUrl} — ${err.message}`);
          overallPassed = false;
        }
      }

      // Phase 2: discover and scan detail pages from existing list content
      console.log('\nDiscovering detail page URLs from existing content...');
      const detailUrls = await discoverDetailUrls(page);
      const detailEntries = Object.entries(detailUrls);
      if (detailEntries.length === 0) {
        console.log('  No existing content found — skipping detail page scan');
      } else {
        console.log(`  Scanning ${detailEntries.length} detail pages...`);
        for (const [type, url] of detailEntries) {
          console.log(`  [${type}] ${url}`);
          try {
            const axeResult = await scanUrl(page, url);
            runs.push(buildRunReport(axeResult, url));
          } catch (err) {
            console.log(`  FAILED [${type}]: ${url} — ${err.message}`);
            overallPassed = false;
          }
        }
      }
    } finally {
      await context.close();
    }
  }

  try {
    // Sequential, not concurrent: two Chromium contexts bootstrapping Angular
    // at once starve each other's CPU on the 2-vCPU CI runner (fine locally,
    // times out there).
    await scanUserPaths();

    if (TEST_ADMIN_PHONE && TEST_ADMIN_OTP) {
      await scanAdminPaths();
    } else {
      console.log('Skipping admin routes (TEST_ADMIN_PHONE/TEST_ADMIN_OTP not set)');
    }
  } finally {
    await browser.close();
  }

  const aggregate = { totalIssues: 0, critical: 0, serious: 0, moderate: 0, minor: 0, unknown: 0 };
  for (const r of runs) {
    for (const key of Object.keys(aggregate)) {
      aggregate[key] += r.summary[key] ?? 0;
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    scanPassed: overallPassed,
    frontendUrl: FRONTEND_URL,
    aggregate,
    runs,
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outFile = path.join(OUT_DIR, `accessibility-report-${timestamp}.json`);
  const htmlFile = path.join(OUT_DIR, `accessibility-report-${timestamp}.html`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
  fs.writeFileSync(htmlFile, buildHtml(report));

  console.log(`\nReport:    ${outFile}`);
  console.log(`Dashboard: ${htmlFile}`);
  console.log(`Total issues: ${aggregate.totalIssues}  (Critical: ${aggregate.critical}  Serious: ${aggregate.serious}  Moderate: ${aggregate.moderate}  Minor: ${aggregate.minor})`);

  const failingScores = runs.filter(r => r.score < SCORE_THRESHOLD);
  const reasons = [];

  if (!overallPassed) {
    reasons.push('one or more pages could not be scanned (see log above)');
  }
  if (aggregate.critical > 0) {
    reasons.push(`${aggregate.critical} critical violation(s)`);
  }
  if (failingScores.length > 0) {
    reasons.push(`${failingScores.length} page(s) below ${Math.round(SCORE_THRESHOLD * 100)}% score`);
  }

  fs.writeFileSync(path.join(OUT_DIR, 'summary.md'), buildMarkdownSummary(report, failingScores, reasons));

  for (const reason of reasons) {
    console.log(`::error::Accessibility: ${reason}`);
  }
  for (const r of failingScores) {
    console.log(`::error::  ${Math.round(r.score * 100)}%  ${r.url}`);
  }

  // Gate the PR: any critical violation, any page under threshold, or any
  // unscannable page fails the check.
  if (reasons.length > 0) process.exit(1);
})();

function buildMarkdownSummary(data, failingScores, reasons) {
  const a = data.aggregate;
  const status = reasons.length === 0
    ? '**Accessibility check passed**'
    : `**Accessibility check failed** — ${reasons.join('; ')}`;

  const lines = [
    '## Accessibility (axe-core, WCAG 2.1 AA)',
    '',
    status,
    '',
    `Scanned **${data.runs.length}** pages at ${data.frontendUrl}`,
    '',
    '| Critical | Serious | Moderate | Minor | Total |',
    '|---|---|---|---|---|',
    `| ${a.critical} | ${a.serious} | ${a.moderate} | ${a.minor} | ${a.totalIssues} |`,
  ];

  if (failingScores.length > 0) {
    lines.push(
      '',
      `<details><summary>Pages below ${Math.round(SCORE_THRESHOLD * 100)}% (${failingScores.length})</summary>`,
      '',
      '| Score | Page | Top failing audits |',
      '|---|---|---|',
      ...failingScores
        .slice()
        .sort((x, y) => x.score - y.score)
        .map(r => {
          const top = r.failingAudits.slice(0, 3).map(x => `\`${x.id}\``).join(', ') || '—';
          return `| ${Math.round(r.score * 100)}% | ${r.url} | ${top} |`;
        }),
      '',
      '</details>',
    );
  }

  return lines.join('\n') + '\n';
}

function buildHtml(data) {
  const COLORS = {
    critical: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', badge: '#ef4444' },
    serious:  { bg: '#ffedd5', border: '#f97316', text: '#9a3412', badge: '#f97316' },
    moderate: { bg: '#fef9c3', border: '#eab308', text: '#854d0e', badge: '#ca8a04' },
    minor:    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', badge: '#3b82f6' },
    unknown:  { bg: '#f3f4f6', border: '#9ca3af', text: '#374151', badge: '#9ca3af' },
  };

  function scoreColor(score) {
    if (score >= 0.9) return '#16a34a';
    if (score >= 0.7) return '#ca8a04';
    return '#dc2626';
  }

  function tabId(url) {
    return url.replace(/[^a-z0-9]/gi, '_');
  }

  function slugLabel(url) {
    try {
      const u = new URL(url);
      const hash = u.hash.replace('#/', '').replace(/\//g, ' › ') || 'home';
      return hash;
    } catch {
      return url;
    }
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function summaryCards(summary) {
    return ['critical', 'serious', 'moderate', 'minor'].map(level => {
      const c = COLORS[level];
      return `<div class="card" style="border-left:4px solid ${c.border};background:${c.bg}">
        <div class="card-count" style="color:${c.text}">${summary[level]}</div>
        <div class="card-label" style="color:${c.text}">${level.charAt(0).toUpperCase() + level.slice(1)}</div>
      </div>`;
    }).join('');
  }

  function auditRows(failingAudits, runKey) {
    if (!failingAudits.length) return '<p style="color:#6b7280;padding:1rem">No failing audits.</p>';
    return failingAudits.map((audit, i) => {
      const c = COLORS[audit.impact] || COLORS.unknown;
      const uid = `${runKey}_audit_${i}`;
      const tags = audit.wcagTags.map(t => `<span class="tag">${escHtml(t)}</span>`).join('');
      const helpLink = audit.helpUrl
        ? `<a class="help-link" href="${escHtml(audit.helpUrl)}" target="_blank" rel="noopener">Docs ↗</a>`
        : '';
      return `<div class="audit-block" style="border-left:3px solid ${c.border}">
        <div class="audit-header" onclick="toggle('${uid}','${runKey}',${i})">
          <span class="impact-badge" style="background:${c.badge}">${audit.impact}</span>
          <span class="audit-title">${escHtml(audit.title)}</span>
          <span class="el-count" style="color:${c.text}">${audit.affectedElementCount} element${audit.affectedElementCount !== 1 ? 's' : ''}</span>
          <span class="tags-inline">${tags}</span>
          ${helpLink}
          <span class="chevron" id="chv_${uid}">▶</span>
        </div>
        <div class="audit-body" id="${uid}">
          <p class="audit-desc">${escHtml(audit.description)}</p>
          <div class="elements-list" id="els_${uid}"><span class="loading">Loading…</span></div>
        </div>
      </div>`;
    }).join('');
  }

  const sidebarItems = data.runs.map((run, i) => {
    const score = Math.round((run.score || 0) * 100);
    const sc = scoreColor(run.score || 0);
    const tid = tabId(run.url);
    const active = i === 0 ? 'active' : '';
    return `<div class="sidebar-item ${active}" onclick="switchTab('${tid}')" id="tab_${tid}">
      <div class="tab-label">${escHtml(slugLabel(run.url))}</div>
      <div class="tab-meta">
        <span class="score-pill" style="background:${sc}">${score}%</span>
        <span class="issue-count">${run.summary.totalIssues} issues</span>
      </div>
    </div>`;
  }).join('');

  const panels = data.runs.map((run, i) => {
    const display = i === 0 ? 'block' : 'none';
    const tid = tabId(run.url);
    const score = Math.round((run.score || 0) * 100);
    const sc = scoreColor(run.score || 0);
    return `<div class="panel" id="panel_${tid}" style="display:${display}">
      <div class="panel-header">
        <div>
          <div class="panel-url">${escHtml(run.url)}</div>
          <div class="panel-meta">Scanned ${new Date(run.fetchTime).toLocaleString()} · axe-core ${escHtml(run.axeCoreVersion || '?')}${run.incompleteCount ? ` · ${run.incompleteCount} incomplete` : ''}</div>
        </div>
        <div class="score-circle" style="border-color:${sc};color:${sc}" title="passing rules / total rules">${score}%</div>
      </div>
      <div class="cards-row">
        <div class="card total-card">
          <div class="card-count">${run.summary.totalIssues}</div>
          <div class="card-label">Total Issues</div>
        </div>
        ${summaryCards(run.summary)}
      </div>
      <div class="section-title">Failing Audits <span class="badge-count">${run.failingAudits.length}</span></div>
      <div class="audits-list">${auditRows(run.failingAudits, tid)}</div>
      <div class="section-title passing-title">Passing Audits <span class="badge-count green">${run.passingAudits.length}</span></div>
      <div class="passing-list">
        ${run.passingAudits.map(a => `<span class="passing-tag" title="${escHtml(a.title)}">${escHtml(a.id)}</span>`).join('')}
      </div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Accessibility Report — ${new Date(data.generatedAt).toLocaleDateString()}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;color:#1e293b;display:flex;height:100vh;overflow:hidden}
.sidebar{width:220px;min-width:220px;background:#1e293b;display:flex;flex-direction:column;overflow-y:auto}
.sidebar-header{padding:1rem;border-bottom:1px solid #334155}
.sidebar-header h1{font-size:0.85rem;font-weight:700;color:#f8fafc;letter-spacing:.05em;text-transform:uppercase}
.sidebar-header .gen-time{font-size:0.7rem;color:#94a3b8;margin-top:2px}
.sidebar-item{padding:.75rem 1rem;cursor:pointer;border-left:3px solid transparent;transition:background .15s}
.sidebar-item:hover{background:#334155}
.sidebar-item.active{background:#0f172a;border-left-color:#3b82f6}
.tab-label{font-size:0.78rem;font-weight:600;color:#e2e8f0;text-transform:capitalize;word-break:break-all}
.tab-meta{display:flex;align-items:center;gap:.4rem;margin-top:.3rem}
.score-pill{font-size:0.65rem;font-weight:700;color:#fff;padding:1px 6px;border-radius:9999px}
.issue-count{font-size:0.68rem;color:#94a3b8}
.sidebar-agg{margin-top:auto;padding:.75rem 1rem;border-top:1px solid #334155;font-size:0.72rem;color:#94a3b8}
.sidebar-agg strong{display:block;color:#cbd5e1;margin-bottom:.3rem}
.agg-row{display:flex;justify-content:space-between;padding:1px 0}
.main{flex:1;overflow-y:auto;padding:1.5rem}
.panel-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem}
.panel-url{font-size:0.78rem;color:#64748b;word-break:break-all;max-width:600px}
.panel-meta{font-size:0.7rem;color:#94a3b8;margin-top:2px}
.score-circle{width:56px;height:56px;border-radius:50%;border:3px solid;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;flex-shrink:0}
.cards-row{display:flex;gap:.75rem;margin-bottom:1.5rem;flex-wrap:wrap}
.card{flex:1;min-width:90px;padding:.75rem 1rem;border-radius:8px;background:#fff;border:1px solid #e2e8f0}
.total-card{background:#f8fafc;border-color:#cbd5e1}
.card-count{font-size:1.6rem;font-weight:700;line-height:1}
.card-label{font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:2px;color:#64748b}
.section-title{font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#475569;margin-bottom:.5rem;display:flex;align-items:center;gap:.4rem}
.badge-count{background:#e2e8f0;color:#475569;font-size:0.7rem;padding:1px 7px;border-radius:9999px}
.badge-count.green{background:#dcfce7;color:#166534}
.passing-title{margin-top:1.5rem}
.passing-list{display:flex;flex-wrap:wrap;gap:.35rem;margin-bottom:2rem}
.passing-tag{font-size:0.65rem;background:#dcfce7;color:#166534;padding:2px 7px;border-radius:4px;border:1px solid #bbf7d0;cursor:default}
.audits-list{display:flex;flex-direction:column;gap:.5rem;margin-bottom:1rem}
.audit-block{background:#fff;border-radius:6px;border:1px solid #e2e8f0;overflow:hidden}
.audit-header{display:flex;align-items:center;gap:.5rem;padding:.6rem .75rem;cursor:pointer;user-select:none;flex-wrap:wrap}
.audit-header:hover{background:#f8fafc}
.impact-badge{font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;padding:2px 7px;border-radius:9999px;flex-shrink:0}
.audit-title{font-size:0.78rem;font-weight:600;flex:1;min-width:0}
.el-count{font-size:0.7rem;font-weight:700;flex-shrink:0}
.tags-inline{display:flex;gap:.25rem;flex-wrap:wrap}
.tag{font-size:0.6rem;background:#f1f5f9;color:#475569;padding:1px 5px;border-radius:3px;border:1px solid #e2e8f0}
.help-link{font-size:0.65rem;color:#3b82f6;text-decoration:none;flex-shrink:0}
.help-link:hover{text-decoration:underline}
.chevron{font-size:0.6rem;color:#94a3b8;transition:transform .2s;flex-shrink:0}
.chevron.open{transform:rotate(90deg)}
.audit-body{display:none;padding:.5rem .75rem .75rem;border-top:1px solid #f1f5f9}
.audit-desc{font-size:0.72rem;color:#64748b;margin-bottom:.75rem;line-height:1.5}
.elements-list{display:flex;flex-direction:column;gap:.4rem}
.element-row{display:flex;gap:.5rem;font-size:0.7rem;background:#f8fafc;border-radius:4px;padding:.4rem .5rem;border:1px solid #e2e8f0}
.el-num{color:#94a3b8;font-weight:700;flex-shrink:0;min-width:20px}
.el-detail{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.selector{color:#2563eb;font-family:monospace;font-size:0.68rem;word-break:break-all}
.snippet{font-family:monospace;font-size:0.68rem;color:#475569;word-break:break-all;background:#f1f5f9;padding:2px 4px;border-radius:3px}
.node-label{color:#94a3b8;font-size:0.65rem;white-space:pre-wrap}
.rel-nodes{margin-top:4px}
.rel-nodes strong{font-size:0.65rem;color:#64748b;display:block;margin-bottom:2px}
.loading{font-size:0.72rem;color:#94a3b8;padding:.5rem}
.load-more{margin-top:.5rem;font-size:0.7rem;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:4px;padding:.3rem .75rem;cursor:pointer;color:#475569;width:100%;text-align:left}
.load-more:hover{background:#e2e8f0}
</style>
</head>
<body>
<div class="sidebar">
  <div class="sidebar-header">
    <h1>A11y Report</h1>
    <div class="gen-time">${new Date(data.generatedAt).toLocaleString()}</div>
  </div>
  ${sidebarItems}
  <div class="sidebar-agg">
    <strong>All URLs combined</strong>
    <div class="agg-row"><span>Total</span><span>${data.aggregate.totalIssues}</span></div>
    <div class="agg-row"><span style="color:#fca5a5">Critical</span><span>${data.aggregate.critical}</span></div>
    <div class="agg-row"><span style="color:#fdba74">Serious</span><span>${data.aggregate.serious}</span></div>
    <div class="agg-row"><span style="color:#fde047">Moderate</span><span>${data.aggregate.moderate}</span></div>
    <div class="agg-row"><span style="color:#93c5fd">Minor</span><span>${data.aggregate.minor}</span></div>
  </div>
</div>
<div class="main">
  ${panels}
</div>
<script>
const TABS = ${JSON.stringify(data.runs.map(r => tabId(r.url)))};

const AUDIT_DATA = ${JSON.stringify(
    data.runs.reduce((acc, run) => {
      const tid = tabId(run.url);
      acc[tid] = run.failingAudits.map(a => ({
        description: a.description,
        elements: a.affectedElements,
      }));
      return acc;
    }, {})
  ).replace(/<\/script/gi, '<\\/script')};

const rendered = {};

function tabId(url) { return url.replace(/[^a-z0-9]/gi, '_'); }

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderElements(uid, runKey, auditIdx) {
  if (rendered[uid]) return;
  rendered[uid] = true;
  const container = document.getElementById('els_' + uid);
  if (!container) return;
  const auditData = AUDIT_DATA[runKey]?.[auditIdx];
  if (!auditData) { container.innerHTML = '<em>No data</em>'; return; }
  const PAGE = 50;
  let offset = 0;
  function renderPage() {
    const slice = auditData.elements.slice(offset, offset + PAGE);
    const html = slice.map((el, j) => {
      const relNodes = el.relatedNodes.length
        ? '<div class="rel-nodes"><strong>Related nodes:</strong>' +
          el.relatedNodes.map(r => '<div class="snippet">' + esc(r.snippet) + '</div>').join('') +
          '</div>'
        : '';
      return '<div class="element-row">' +
        '<div class="el-num">#' + (offset + j + 1) + '</div>' +
        '<div class="el-detail">' +
          '<div class="selector">' + esc(el.selector) + '</div>' +
          '<div class="snippet">' + esc(el.snippet) + '</div>' +
          (el.nodeLabel ? '<div class="node-label">' + esc(el.nodeLabel) + '</div>' : '') +
          relNodes +
        '</div></div>';
    }).join('');
    if (offset === 0) container.innerHTML = html;
    else container.insertAdjacentHTML('beforeend', html);
    offset += PAGE;
    if (offset < auditData.elements.length) {
      const remaining = auditData.elements.length - offset;
      const btn = document.createElement('button');
      btn.className = 'load-more';
      btn.textContent = 'Show ' + Math.min(PAGE, remaining) + ' more of ' + remaining + ' remaining';
      btn.onclick = () => { btn.remove(); renderPage(); };
      container.appendChild(btn);
    }
  }
  renderPage();
}

function switchTab(tid) {
  TABS.forEach(t => {
    const panel = document.getElementById('panel_' + tabId(t));
    const tab = document.getElementById('tab_' + tabId(t));
    if (panel) panel.style.display = tabId(t) === tid ? 'block' : 'none';
    if (tab) tab.classList.toggle('active', tabId(t) === tid);
  });
}

function toggle(uid, runKey, auditIdx) {
  const body = document.getElementById(uid);
  const chv = document.getElementById('chv_' + uid);
  if (!body) return;
  const open = body.style.display === 'block';
  body.style.display = open ? 'none' : 'block';
  if (chv) chv.classList.toggle('open', !open);
  if (!open) renderElements(uid, runKey, auditIdx);
}
</script>
</body>
</html>`;
}
