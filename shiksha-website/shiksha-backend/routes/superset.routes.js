const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isAuthenticated } = require("../middlewares/auth.js");

const SUPERSET_URL = process.env.SUPERSET_URL;
const SUPERSET_ADMIN_USERNAME = process.env.SUPERSET_ADMIN_USERNAME;
const SUPERSET_ADMIN_PASSWORD = process.env.SUPERSET_ADMIN_PASSWORD;
const SUPERSET_DASHBOARD_UUID = process.env.SUPERSET_DASHBOARD_UUID;

const ROLE_MAP = {
  power: "HM", standard: "HM", hm: "HM",
  crp: "CRP", beo: "BEO", ddpi: "DDPI",
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
      // block-level: teachers in same region (block)
      return `user_id IN (SELECT user_id FROM dim_users WHERE region_id = (SELECT region_id FROM dim_users WHERE user_id = '${uid}'))`;
    case "DDPI":
      // district-level: all blocks under same district parent
      return `user_id IN (SELECT user_id FROM dim_users WHERE region_id IN (SELECT r.region_id FROM dim_regions r WHERE r.parent_id = (SELECT dr.parent_id FROM dim_regions dr JOIN dim_users du ON du.region_id = dr.region_id WHERE du.user_id = '${uid}')))`;
    default:
      return `user_id = '${uid}'`;
  }
}

async function getSupersetAdminToken() {
  const resp = await axios.post(`${SUPERSET_URL}/api/v1/security/login`, {
    username: SUPERSET_ADMIN_USERNAME,
    password: SUPERSET_ADMIN_PASSWORD,
    provider: "db",
    refresh: false,
  });
  const token = resp.data?.access_token;
  if (!token) throw new Error("Superset admin login failed — no token returned");
  return token;
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

    const isAdmin = !!req.adminUser;
    const roles = mongoUser.role || [];
    const mappedRole = isAdmin ? "StateAdmin" : mapRole(roles);
    const uid = String(mongoUser._id);

    const rlsClause = buildRlsClause(uid, mappedRole);

    const adminToken = await getSupersetAdminToken();

    const body = {
      user: {
        username: uid,
        first_name: (mongoUser.name || "").split(" ")[0] || "User",
        last_name:  (mongoUser.name || "").split(" ").slice(1).join(" "),
      },
      resources: [{ type: "dashboard", id: SUPERSET_DASHBOARD_UUID }],
      rls: rlsClause ? [{ clause: rlsClause }] : [],
    };

    const guestResp = await axios.post(
      `${SUPERSET_URL}/api/v1/security/guest_token/`,
      body,
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    const token = guestResp.data?.token;
    if (!token) throw new Error("No token in Superset guest_token response");

    res.json({ token });
  } catch (err) {
    console.error("[superset] guest-token error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate dashboard token" });
  }
});

module.exports = router;
