const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/auth.js");

const SUPERSET_URL = process.env.SUPERSET_URL;
const SUPERSET_ADMIN_USERNAME = process.env.SUPERSET_ADMIN_USERNAME;
const SUPERSET_ADMIN_PASSWORD = process.env.SUPERSET_ADMIN_PASSWORD;
const SUPERSET_DASHBOARD_UUID = process.env.SUPERSET_DASHBOARD_UUID;

const AXIOS_TIMEOUT_MS = 10_000;

// In-memory cache for Superset admin session — avoids a full login per request.
let _authCache = null; // { accessToken, csrfToken, cookieHeader, expiresAt }

function _authCacheValid() {
  return _authCache && _authCache.expiresAt > Date.now() + 30_000;
}

const ROLE_MAP = {
  power: "HM", standard: "HM", hm: "HM",
  crp: "CRP", beo: "BEO", meo: "MEO",
  deo: "DEO", ddpi: "DDPI",
  admin: "StateAdmin", manager: "StateAdmin", state: "StateAdmin",
};

function mapRole(roles = []) {
  for (const r of roles) {
    const mapped = ROLE_MAP[(r || "").toLowerCase()];
    if (mapped) return mapped;
  }
  return "HM";
}

// uid is a MongoDB ObjectId hex string — validate before interpolating into SQL
function assertSafeId(uid) {
  if (!/^[a-f0-9]{24}$/.test(uid)) throw new Error(`Unsafe user id: ${uid}`);
}

function buildRlsClause(uid, mappedRole) {
  assertSafeId(uid);
  switch (mappedRole) {
    case "StateAdmin":
      return null;
    case "HM":
      // school-level: only teachers at same school
      return `user_id IN (SELECT user_id FROM dim_users WHERE school_id = (SELECT school_id FROM dim_users WHERE user_id = '${uid}'))`;
    case "CRP":
    case "BEO":
    case "MEO":
      // block-level: teachers in same region (block)
      return `user_id IN (SELECT user_id FROM dim_users WHERE region_id = (SELECT region_id FROM dim_users WHERE user_id = '${uid}'))`;
    case "DEO":
    case "DDPI":
      // district-level: all blocks under same district parent
      return `user_id IN (SELECT user_id FROM dim_users WHERE region_id IN (SELECT r.region_id FROM dim_regions r WHERE r.parent_id = (SELECT dr.parent_id FROM dim_regions dr JOIN dim_users du ON du.region_id = dr.region_id WHERE du.user_id = '${uid}')))`;
    default:
      return `user_id = '${uid}'`;
  }
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
  if (!accessToken) throw new Error("Superset admin login failed — no token returned");

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
router.post("/superset/guest-token", isAuthenticated, async (req, res) => {
  try {
    if (!SUPERSET_URL || !SUPERSET_ADMIN_USERNAME || !SUPERSET_ADMIN_PASSWORD || !SUPERSET_DASHBOARD_UUID) {
      return res.status(503).json({ error: "Superset not configured (missing env vars)" });
    }

    const mongoUser = req.adminUser || req.user;
    if (!mongoUser) return res.status(401).json({ error: "No authenticated user" });

    const roles = mongoUser.role || [];
    const mappedRole = mapRole(roles);
    const uid = String(mongoUser._id);

    const rlsClause = buildRlsClause(uid, mappedRole);

    const { accessToken: adminToken, csrfToken, cookieHeader } = await getSupersetAuth();

    const body = {
      user: {
        username: uid,
        first_name: (mongoUser.name || "").split(" ")[0] || "User",
        last_name:  (mongoUser.name || "").split(" ").slice(1).join(" "),
      },
      resources: [{ type: "dashboard", id: SUPERSET_DASHBOARD_UUID }],
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

    res.json({ token });
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

module.exports = router;
