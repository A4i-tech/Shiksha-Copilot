const express = require('express');
const request = require('supertest');

jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => next(),
  requirePermission: () => (req, res, next) => next(),
}));
jest.mock('../../../helper/superset.helper.js', () => ({
  isSupersetConfigured: jest.fn(),
  runAnalyticsSql: jest.fn(),
}));

const { isSupersetConfigured, runAnalyticsSql } = require('../../../helper/superset.helper.js');
const analyticsRoutes = require('../../../routes/analytics.routes.js');

const app = express();
app.use('/api', analyticsRoutes);

describe('GET /api/analytics/sync-status', () => {
  let errorSpy;

  beforeEach(() => {
    isSupersetConfigured.mockReset().mockReturnValue(true);
    runAnalyticsSql.mockReset();
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => errorSpy.mockRestore());

  it('returns the ETL last sync time read from etl_metadata', async () => {
    runAnalyticsSql.mockResolvedValue([{ value: '2026-10-22T01:18:27.296664+00:00' }]);

    const res = await request(app).get('/api/analytics/sync-status');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ lastSyncAt: '2026-10-22T01:18:27.296664+00:00' });
    expect(runAnalyticsSql).toHaveBeenCalledTimes(1);
    expect(runAnalyticsSql.mock.calls[0][0]).toMatch(/FROM etl_metadata WHERE key = 'etl_last_sync'/);
  });

  it('returns null when the ETL has never recorded a sync', async () => {
    runAnalyticsSql.mockResolvedValue([]);

    const res = await request(app).get('/api/analytics/sync-status');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ lastSyncAt: null });
  });

  it('returns 503 without querying when Superset is not configured', async () => {
    isSupersetConfigured.mockReturnValue(false);

    const res = await request(app).get('/api/analytics/sync-status');

    expect(res.status).toBe(503);
    expect(runAnalyticsSql).not.toHaveBeenCalled();
  });

  it('returns 500 when the query fails', async () => {
    runAnalyticsSql.mockRejectedValue(new Error('Superset down'));

    const res = await request(app).get('/api/analytics/sync-status');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch sync status' });
  });
});
