const axios = require("axios");

const AXIOS_TIMEOUT_MS = 10_000;
const SQL_TIMEOUT_MS = 30_000;
const ANALYTICS_DB_NAME = "Analytics DB";

// In-memory cache for the Superset admin session, so a request does not need a full login.
let _authCache = null; // { accessToken, csrfToken, cookieHeader, expiresAt }
let _analyticsDbId = null;

function config() {
  return {
    url: process.env.SUPERSET_URL,
    username: process.env.SUPERSET_ADMIN_USERNAME,
    password: process.env.SUPERSET_ADMIN_PASSWORD,
  };
}

function isSupersetConfigured() {
  const { url, username, password } = config();
  return Boolean(url && username && password);
}

function _authCacheValid() {
  return _authCache && _authCache.expiresAt > Date.now() + 30_000;
}

function resetSupersetAuth() {
  _authCache = null;
}

async function getSupersetAuth() {
  if (_authCacheValid()) return _authCache;

  const { url, username, password } = config();
  const loginResp = await axios.post(`${url}/api/v1/security/login`, {
    username,
    password,
    provider: "db",
    refresh: false,
  }, { timeout: AXIOS_TIMEOUT_MS });
  const accessToken = loginResp.data?.access_token;
  if (!accessToken) throw new Error("Superset admin login failed — no token returned");

  // Carry session cookie so Superset CSRF validation can find the session token
  const loginCookies = loginResp.headers["set-cookie"] || [];
  const cookieHeader = loginCookies.map((c) => c.split(";")[0]).join("; ");

  const csrfResp = await axios.get(`${url}/api/v1/security/csrf_token/`, {
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

async function getAnalyticsDbId(auth) {
  if (_analyticsDbId) return _analyticsDbId;
  const { url } = config();
  const dbsResp = await axios.get(`${url}/api/v1/database/?q=(page_size:50)`, {
    headers: { Authorization: `Bearer ${auth.accessToken}` },
    timeout: AXIOS_TIMEOUT_MS,
  });
  const id = dbsResp.data.result?.find((d) => d.database_name === ANALYTICS_DB_NAME)?.id;
  if (!id) throw new Error(`${ANALYTICS_DB_NAME} not found in Superset`);
  _analyticsDbId = id;
  return id;
}

async function executeSql(auth, databaseId, sqlQuery) {
  const { url } = config();
  return axios.post(
    `${url}/api/v1/sqllab/execute/`,
    { database_id: databaseId, sql: sqlQuery, runAsync: false },
    {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
        "X-CSRFToken": auth.csrfToken,
        Cookie: auth.cookieHeader,
        Referer: url,
      },
      timeout: SQL_TIMEOUT_MS,
    },
  );
}

// Runs a query on the analytics database through Superset SQL Lab and returns the rows.
// Build `sqlQuery` from trusted text only. Retries once if the admin session has expired.
async function runAnalyticsSql(sqlQuery) {
  let auth = await getSupersetAuth();
  const databaseId = await getAnalyticsDbId(auth);
  let resp;
  try {
    resp = await executeSql(auth, databaseId, sqlQuery);
  } catch (err) {
    if (err?.response?.status !== 401) throw err;
    resetSupersetAuth();
    auth = await getSupersetAuth();
    resp = await executeSql(auth, databaseId, sqlQuery);
  }
  return resp.data?.data ?? [];
}

// GET on the Superset REST API as the admin. Retries once if the admin session has expired.
async function supersetGet(path) {
  const { url } = config();
  const get = (auth) => axios.get(`${url}/api/v1${path}`, { headers: { Authorization: `Bearer ${auth.accessToken}` }, timeout: AXIOS_TIMEOUT_MS });
  let resp;
  try {
    resp = await get(await getSupersetAuth());
  } catch (err) {
    if (err?.response?.status !== 401) throw err;
    resetSupersetAuth();
    resp = await get(await getSupersetAuth());
  }
  return resp.data.result;
}

module.exports = {
  isSupersetConfigured,
  supersetGet,
  getSupersetAuth,
  resetSupersetAuth,
  runAnalyticsSql,
};
