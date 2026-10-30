const express = require("express");
const request = require("supertest");

jest.mock("../../../dao/metadata.dao.js", () => ({}));
jest.mock("../../../middlewares/auth.js", () => ({
  isAuthenticated: (req, res, next) => next(),
  requirePermission: () => (req, res, next) => next(),
}));

const analyticsRoutes = require("../../../routes/analytics.routes.js");

const app = express().use("/api", analyticsRoutes);

describe("GET /api/analytics/config", () => {
  const saved = { ...process.env };
  afterEach(() => {
    process.env = { ...saved };
  });

  it("returns the Umami config without authentication", async () => {
    process.env.UMAMI_URL = "https://umami.test";
    process.env.UMAMI_WEBSITE_ID = "site-1";

    const res = await request(app).get("/api/analytics/config");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ umamiUrl: "https://umami.test", umamiWebsiteId: "site-1" });
  });

  it("returns 404 when either value is unset", async () => {
    process.env.UMAMI_URL = "https://umami.test";
    delete process.env.UMAMI_WEBSITE_ID;

    const res = await request(app).get("/api/analytics/config");

    expect(res.status).toBe(404);
  });
});
