const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const { getPermission } = require("../helper/permission.helper.js");
const AuditLog = require("../models/audit.log.model.js");

const SUPERSET_URL = process.env.SUPERSET_URL;
const SUPERSET_ADMIN_USERNAME = process.env.SUPERSET_ADMIN_USERNAME;
const SUPERSET_ADMIN_PASSWORD = process.env.SUPERSET_ADMIN_PASSWORD;
const SUPERSET_DASHBOARD_UUID = process.env.SUPERSET_DASHBOARD_UUID;
const SUPERSET_MOBILE_DASHBOARD_UUID = process.env.SUPERSET_MOBILE_DASHBOARD_UUID;

const AXIOS_TIMEOUT_MS = 10_000;

// In-memory cache for Superset admin session â€” avoids a full login per request.
let _authCache = null; // { accessToken, csrfToken, cookieHeader, expiresAt }

function _authCacheValid() {
  return _authCache && _authCache.expiresAt > Date.now() + 30_000;
}

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
      DISTRICT: `SELECT d.region_id FROM dim_regions d JOIN dim_regions z ON d.parent_id = z.region_id JOIN dim_regions s ON z.parent_id = s.region_id WHERE d.type = 'district' AND d.name = ${sql(scope.dep.district)} AND z.name = ${sql(scope.dep.zone)} AND s.name = ${sql(scope.dep.state)}`,
      BLOCK: `SELECT b.region_id FROM dim_regions b JOIN dim_regions d ON b.parent_id = d.region_id JOIN dim_regions z ON d.parent_id = z.region_id JOIN dim_regions s ON z.parent_id = s.region_id WHERE b.type = 'block' AND b.name = ${sql(scope.dep.block)} AND d.name = ${sql(scope.dep.district)} AND z.name = ${sql(scope.dep.zone)} AND s.name = ${sql(scope.dep.state)}`,
    };
    return `user_id IN (SELECT user_id FROM dim_users WHERE region_id IN (WITH RECURSIVE scoped AS (${starts[scope.scopeType]} UNION ALL SELECT child.region_id FROM dim_regions child JOIN scoped parent ON child.parent_id = parent.region_id) SELECT region_id FROM scoped))`;
  });
    const validClauses = clauses.filter(Boolean);
  return validClauses.length ? `(${validClauses.join(" OR ")})` : "FALSE";
}

async function getSupersetAuth() {
  if (_authCacheValid()) return _authCache;

  const loginResp = await axios.post(`${SUPERSET_URL}/api/v1/security/login`, {
    username: SUPERSET_ADMIN_USERNAME,
    password: SUPERSET_ADMIN_PASSWORD,
    provider: "db",
    refresh: false,
  }, { timeout: AXIOS_TIMEOUT_MS });
  const accessToken = loginResp.data?.access_token;
  if (!accessToken) throw new Error("Superset admin login failed â€” no token returned");

  // Carry session cookie so Superset CSRF validation can find the session token
  const loginCookies = loginResp.headers["set-cookie"] || [];
  const cookieHeader = loginCookies.map((c) => c.split(";")[0]).join("; ");

  const csrfResp = await axios.get(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
    headers: { Authorization: `Bearer ${accessToken}`, Cookie: cookieHeader },
    timeout: AXIOS_TIMEOUT_MS,
  });
  const csrfToken = csrfResp.data?.result;
  if (!csrfToken) throw new Error("Failed to get CSRF token from Superset");

  // Merge any new cookies set by csrf_token endpoint
  const csrfCookies = (csrfResp.headers["set-cookie"] || []).map((c) => c.split(";")[0]);
  const mergedCookies = [...loginCookies.map((c) => c.split(";")[0]), ...csrfCookies].join("; ");

  // Cache for 4 minutes (Superset JWT default expiry is 5 min)
  _authCache = {
    accessToken,
    csrfToken,
    cookieHeader: mergedCookies,
    expiresAt: Date.now() + 4 * 60 * 1000,
  };
  return _authCache;
}

// POST /api/superset/guest-token
// Returns a short-lived Superset guest token scoped to the logged-in user.
router.post("/superset/guest-token", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  try {
    if (!SUPERSET_URL || !SUPERSET_ADMIN_USERNAME || !SUPERSET_ADMIN_PASSWORD || !SUPERSET_DASHBOARD_UUID) {
      return res.status(503).json({ error: "Superset not configured (missing env vars)" });
    }

    const mongoUser = req.user;
    if (!mongoUser) return res.status(401).json({ error: "No authenticated user" });

    const uid = String(mongoUser._id);
    const rlsClause = buildRlsClause(getPermission(req.permissions, "analytics.view"));

    const { accessToken: adminToken, csrfToken, cookieHeader } = await getSupersetAuth();

    const body = {
      user: {
        username: uid,
        first_name: (mongoUser.identity.name || "").split(" ")[0] || "User",
        last_name:  (mongoUser.identity.name || "").split(" ").slice(1).join(" "),
      },
      resources: [
        { type: "dashboard", id: SUPERSET_DASHBOARD_UUID },
        ...(SUPERSET_MOBILE_DASHBOARD_UUID ? [{ type: "dashboard", id: SUPERSET_MOBILE_DASHBOARD_UUID }] : []),
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
      // Admin token expired â€” clear cache and retry once
      if (guestErr?.response?.status === 401) {
        _authCache = null;
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

    // Fire-and-forget audit log â€” don't fail the request if this errors
    AuditLog.create({
      eventType: "Dashboard Token",
      status: "success",
      userId: mongoUser._id,
      name: mongoUser.identity.name || "Unknown",
    }).catch((e) => console.error("[superset] audit log failed:", e.message));

    res.json({
      token,
      dashboardUuid: SUPERSET_DASHBOARD_UUID,
      mobileDashboardUuid: SUPERSET_MOBILE_DASHBOARD_UUID || null,
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

// GET /api/superset/district-drill?district=<name>
// Returns block-level lesson plan counts for the given district.
router.get("/superset/district-drill", isAuthenticated, requirePermission("analytics.view"), async (req, res) => {
  const district = String(req.query.district || "").trim();
  if (!district) return res.status(400).json({ error: "district required" });
  if (!/^[\w\s\-()',./]+$/.test(district)) return res.status(400).json({ error: "invalid district name" });

  try {
    const { accessToken: adminToken, csrfToken, cookieHeader } = await getSupersetAuth();

    // Look up Analytics DB id in Superset
    const dbsResp = await axios.get(`${SUPERSET_URL}/api/v1/database/?q=(page_size:50)`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      timeout: AXIOS_TIMEOUT_MS,
    });
    const dbId = dbsResp.data.result?.find(d => d.database_name === "Analytics DB")?.id;
    if (!dbId) throw new Error("Analytics DB not found in Superset");

    // Apply scope restriction: for STATE scope, verify the district is in the user's state
    const analyticsScopes = getPermission(req.permissions, "analytics.view");
    const isGlobal = analyticsScopes?.some(s => s.scopeType === "GLOBAL");
    const stateScope = analyticsScopes?.find(s => s.scopeType === "STATE");
    const stateName = stateScope?.dep?.state ?? null;

    const stateClause = (!isGlobal && stateName)
      ? `AND s.name = ${sql(stateName)}`
      : "";

    const sqlQuery = `
      SELECT b.name AS block_name, COALESCE(COUNT(DISTINCT flp.lp_id), 0) AS lp_count
      FROM dim_regions b
      JOIN dim_regions d ON b.parent_id = d.region_id AND d.type = 'district'
      JOIN dim_regions s ON d.parent_id = s.region_id AND s.type = 'state'
      JOIN dim_users du ON du.region_id = b.region_id
      LEFT JOIN fact_lesson_plans flp ON flp.user_id = du.user_id
      WHERE b.type = 'block' AND d.name = ${sql(district)} ${stateClause}
      GROUP BY b.name
      ORDER BY lp_count DESC
      LIMIT 50
    `;

    let sqlResp;
    try {
      sqlResp = await axios.post(
        `${SUPERSET_URL}/api/v1/sqllab/execute/`,
        { database_id: dbId, sql: sqlQuery, runAsync: false },
        { headers: { Authorization: `Bearer ${adminToken}`, "X-CSRFToken": csrfToken, Cookie: cookieHeader, Referer: SUPERSET_URL }, timeout: 30_000 },
      );
    } catch (e) {
      if (e?.response?.status === 401) {
        _authCache = null;
        const fresh = await getSupersetAuth();
        sqlResp = await axios.post(
          `${SUPERSET_URL}/api/v1/sqllab/execute/`,
          { database_id: dbId, sql: sqlQuery, runAsync: false },
          { headers: { Authorization: `Bearer ${fresh.accessToken}`, "X-CSRFToken": fresh.csrfToken, Cookie: fresh.cookieHeader, Referer: SUPERSET_URL }, timeout: 30_000 },
        );
      } else throw e;
    }

    const rows = sqlResp.data?.data ?? [];
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
