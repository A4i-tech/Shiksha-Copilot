const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isAuthenticated, requirePermission, requireUnscopedPermission } = require("../middlewares/auth.js");
const { getPermission } = require("../helper/permission.helper.js");
const { getSupersetAuth, resetSupersetAuth, runAnalyticsSql } = require("../helper/superset.helper.js");
const AuditLog = require("../models/audit.log.model.js");
const DashboardConfigDao = require("../dao/dashboard.config.dao.js");
const { grantedChartKeys, resolveDashboard, buildScope } = require("../helper/dashboard.helper.js");
const { refreshBoards } = require("../helper/dashboard.sync.js");
const { saveBoard, chartsMismatch, undelegatable } = require("../helper/dashboard.boards.js");
const { validateBoardSave } = require("../validations/dashboard.validation.js");

const SUPERSET_URL = process.env.SUPERSET_URL;
const SUPERSET_ADMIN_USERNAME = process.env.SUPERSET_ADMIN_USERNAME;
const SUPERSET_ADMIN_PASSWORD = process.env.SUPERSET_ADMIN_PASSWORD;

const dashboardConfigDao = new DashboardConfigDao();

const AXIOS_TIMEOUT_MS = 10_000;

function sql(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function buildRlsClause(scopes) {
  if (scopes.some((scope) => scope.scopeType === "GLOBAL")) return null;
  const clauses = scopes.map((scope) => {
    if (scope.scopeType === "UNBOUND") return "FALSE";
    if (scope.scopeType === "SCHOOL") {
      return `user_id IN (SELECT user_id FROM dim_users WHERE school_id IN (SELECT school_id FROM dim_schools WHERE source_id = ${sql(scope.dep)}))`;
    }
    if (scope.dep == null) return "FALSE";
    const starts = {
      STATE: `SELECT s.region_id FROM dim_regions s WHERE s.type = 'state' AND s.name = ${sql(scope.dep.state)}`,
      ZONE: `SELECT z.region_id FROM dim_regions z JOIN dim_regions s ON z.parent_id = s.region_id WHERE z.type = 'zone' AND z.name = ${sql(scope.dep.zone)} AND s.name = ${sql(scope.dep.state)}`,
      DISTRICT: `SELECT d.region_id FROM dim_regions d WHERE d.type = 'district' AND d.name = ${sql(scope.dep.district)} AND d.parent_id = (SELECT region_id FROM dim_regions WHERE type = 'state' AND name = ${sql(scope.dep.state)})`,
      BLOCK: `SELECT b.region_id FROM dim_regions b JOIN dim_regions d ON b.parent_id = d.region_id WHERE b.type = 'block' AND b.name = ${sql(scope.dep.block)} AND d.type = 'district' AND d.name = ${sql(scope.dep.district)} AND d.parent_id = (SELECT region_id FROM dim_regions WHERE type = 'state' AND name = ${sql(scope.dep.state)})`,
    };
    return `user_id IN (SELECT user_id FROM dim_users WHERE region_id IN (WITH RECURSIVE scoped AS (${starts[scope.scopeType]} UNION ALL SELECT child.region_id FROM dim_regions child JOIN scoped parent ON child.parent_id = parent.region_id) SELECT region_id FROM scoped))`;
  });
    const validClauses = clauses.filter(Boolean);
  return validClauses.length ? `(${validClauses.join(" OR ")})` : "FALSE";
}

// POST /api/superset/guest-token
// Returns a short-lived Superset guest token scoped to the logged-in user.
router.post("/superset/guest-token", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  try {
    if (!SUPERSET_URL || !SUPERSET_ADMIN_USERNAME || !SUPERSET_ADMIN_PASSWORD) {
      return res.status(503).json({ error: "Superset not configured (missing env vars)" });
    }

    const mongoUser = req.user;
    if (!mongoUser) return res.status(401).json({ error: "No authenticated user" });

    const uid = String(mongoUser._id);
    const analyticsGrants = getPermission(req.permissions, "analytics.view");
    const rlsClause = buildRlsClause(analyticsGrants);
    const chartKeys = grantedChartKeys(req.permissions);
    if (!chartKeys.length) return res.status(403).json({ error: "You do not have access to any dashboard charts. Ask an administrator to grant chart permissions." });
    await refreshBoards();
    let resolved = resolveDashboard(chartKeys, await dashboardConfigDao.findAllBoards());
    if (!resolved) {
      await refreshBoards(true);
      resolved = resolveDashboard(chartKeys, await dashboardConfigDao.findAllBoards());
    }
    if (!resolved) {
      console.warn("[superset] no board holds the charts of user", uid, chartKeys.join(", "));
      return res.status(503).json({ error: "No dashboard board holds your charts. Ask an administrator to add a board that includes them." });
    }
    const { desktopUuid, mobileUuid } = resolved;

    const { accessToken: adminToken, csrfToken, cookieHeader } = await getSupersetAuth();

    const body = {
      user: {
        username: uid,
        first_name: (mongoUser.identity.name || "").split(" ")[0] || "User",
        last_name:  (mongoUser.identity.name || "").split(" ").slice(1).join(" "),
      },
      resources: [
        { type: "dashboard", id: desktopUuid },
        ...(mobileUuid ? [{ type: "dashboard", id: mobileUuid }] : []),
      ],
      rls: rlsClause ? [{ clause: rlsClause }] : [],
    };

    let guestResp;
    try {
      guestResp = await axios.post(
        `${SUPERSET_URL}/api/v1/security/guest_token/`,
        body,
        { headers: { Authorization: `Bearer ${adminToken}`, "X-CSRFToken": csrfToken, Cookie: cookieHeader, Referer: SUPERSET_URL }, timeout: AXIOS_TIMEOUT_MS }
      );
    } catch (guestErr) {
      // Admin token expired — clear cache and retry once
      if (guestErr?.response?.status === 401) {
        resetSupersetAuth();
        const fresh = await getSupersetAuth();
        guestResp = await axios.post(
          `${SUPERSET_URL}/api/v1/security/guest_token/`,
          body,
          { headers: { Authorization: `Bearer ${fresh.accessToken}`, "X-CSRFToken": fresh.csrfToken, Cookie: fresh.cookieHeader, Referer: SUPERSET_URL }, timeout: AXIOS_TIMEOUT_MS }
        );
      } else {
        throw guestErr;
      }
    }

    const token = guestResp.data?.token;
    if (!token) throw new Error("No token in Superset guest_token response");

    // Fire-and-forget audit log — don't fail the request if this errors
    AuditLog.create({
      eventType: "Dashboard Token",
      status: "success",
      userId: mongoUser._id,
      name: mongoUser.identity.name || "Unknown",
    }).catch((e) => console.error("[superset] audit log failed:", e.message));

    res.json({
      token,
      dashboardUuid: desktopUuid,
      mobileDashboardUuid: mobileUuid,
      supersetUrl: SUPERSET_URL,
      scope: buildScope(analyticsGrants),
    });
  } catch (err) {
    const isTimeout = err.code === "ECONNABORTED";
    const statusCode = err?.response?.status;
    console.error("[superset] guest-token failed", {
      url: err?.config?.url,
      statusCode,
      message: isTimeout ? "timeout" : err.message,
    });
    res.status(isTimeout ? 503 : 500).json({ error: "Failed to generate dashboard token" });
  }
});

// Superset embedded uuid -> dashboard id -> chart names. A swapped uuid would expose the restricted charts.
async function assertBoardMatches(uuid, chartKeys) {
  const { accessToken } = await getSupersetAuth();
  const config = { headers: { Authorization: `Bearer ${accessToken}` }, timeout: AXIOS_TIMEOUT_MS };
  let charts;
  try {
    const embedded = await axios.get(`${SUPERSET_URL}/api/v1/embedded_dashboard/${uuid}`, config);
    charts = await axios.get(`${SUPERSET_URL}/api/v1/dashboard/${embedded.data.result.dashboard_id}/charts`, config);
  } catch (err) {
    if (err?.response?.status === 404) throw Object.assign(new Error(`UUID ${uuid} is not an embedded Superset dashboard. Check the UUID.`), { status: 422 });
    throw err;
  }
  const message = chartsMismatch(charts.data.result.map((chart) => chart.slice_name), chartKeys);
  if (message) throw Object.assign(new Error(`UUID ${uuid}: ${message}`), { status: 422 });
}

// PUT /api/superset/boards
// Creates or updates one board row. The backend reads board ids only from MongoDB.
router.put("/superset/boards", isAuthenticated, requireUnscopedPermission("role.manage"), validateBoardSave, async (req, res) => {
  try {
    const { chartKeys, desktopUuid, mobileUuid } = req.body;
    const blocked = undelegatable(chartKeys, req.permissions.map((grant) => grant.permission), Boolean(getPermission(req.permissions, "role.delegate")));
    if (blocked.length) return res.status(403).json({ error: `You cannot grant permissions you do not hold: ${blocked.join(", ")}. Ask an administrator with role.delegate.` });
    await assertBoardMatches(desktopUuid, chartKeys);
    if (mobileUuid) await assertBoardMatches(mobileUuid, chartKeys);
    const saved = await saveBoard(req.body);
    AuditLog.create({
      eventType: "Dashboard Board Save",
      status: "success",
      userId: req.user._id,
      name: req.user.identity.name || "Unknown",
    }).catch((e) => console.error("[superset] audit log failed:", e.message));
    res.json(saved);
  } catch (err) {
    console.error("[superset] save board failed:", err.message);
    res.status(err.status || 500).json({ error: err.status ? err.message : "Failed to save the dashboard board. Try again." });
  }
});

// GET /api/superset/district-drill?district=<name>
// Returns block-level lesson plan counts for the given district.
router.get("/superset/district-drill", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  const district = String(req.query.district || "").trim();
  if (!district) return res.status(400).json({ error: "district required" });
  if (!/^[\w\s\-()',./]+$/.test(district)) return res.status(400).json({ error: "invalid district name" });

  try {
    const analyticsScopes = getPermission(req.permissions, "analytics.view");
    const rlsClause = buildRlsClause(analyticsScopes);
    if (rlsClause === "FALSE") return res.json({ district, blocks: [] });
    const userFilter = rlsClause
      ? `AND ${rlsClause.replaceAll("user_id IN (SELECT", "du.user_id IN (SELECT")}`
      : "";

    const sqlQuery = `
      SELECT b.name AS block_name, COALESCE(COUNT(DISTINCT flp.lp_id), 0) AS lp_count
      FROM dim_regions b
      JOIN dim_regions d ON b.parent_id = d.region_id AND d.type = 'district'
      JOIN dim_users du ON du.region_id = b.region_id
      LEFT JOIN fact_lesson_plans flp ON flp.user_id = du.user_id
      WHERE b.type = 'block' AND d.name = ${sql(district)} ${userFilter}
      GROUP BY b.name
      ORDER BY lp_count DESC
      LIMIT 50
    `;

    const rows = await runAnalyticsSql(sqlQuery);
    res.json({
      district,
      blocks: rows.map(r => ({ name: r.block_name, lpCount: Number(r.lp_count) })),
    });
  } catch (err) {
    console.error("[superset] district-drill failed:", { message: err.message, status: err?.response?.status, body: JSON.stringify(err?.response?.data)?.slice(0, 300) });
    res.status(500).json({ error: "Failed to fetch block data" });
  }
});

module.exports = router;
