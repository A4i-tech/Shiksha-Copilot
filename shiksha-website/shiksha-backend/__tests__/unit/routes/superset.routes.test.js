jest.mock('axios');
jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { _id: 'user-1', identity: { name: 'Test Leader' } };
    req.permissions = {};
    next();
  },
  requirePermission: () => (req, res, next) => next(),
}));
jest.mock('../../../helper/permission.helper.js', () => ({ getPermission: jest.fn() }));
jest.mock('../../../helper/superset.helper.js', () => ({
  getSupersetAuth: jest.fn(),
  resetSupersetAuth: jest.fn(),
  runAnalyticsSql: jest.fn(),
}));
jest.mock('../../../models/audit.log.model.js', () => ({ create: jest.fn().mockResolvedValue({}) }));

const express = require('express');
const request = require('supertest');

describe('superset routes', () => {
  let axios;
  let helper;
  let getPermission;
  let app;
  let errorSpy;

  beforeEach(() => {
    jest.resetModules();
    process.env.SUPERSET_URL = 'http://superset:8088';
    process.env.SUPERSET_ADMIN_USERNAME = 'admin';
    process.env.SUPERSET_ADMIN_PASSWORD = 'test-password';
    process.env.SUPERSET_DASHBOARD_UUID = 'dash-desktop';
    process.env.SUPERSET_MOBILE_DASHBOARD_UUID = 'dash-mobile';
    axios = require('axios');
    helper = require('../../../helper/superset.helper.js');
    ({ getPermission } = require('../../../helper/permission.helper.js'));
    helper.getSupersetAuth.mockResolvedValue({ accessToken: 't', csrfToken: 'c', cookieHeader: 'k' });
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    app = express();
    app.use(express.json());
    app.use('/api', require('../../../routes/superset.routes.js'));
  });

  afterEach(() => errorSpy.mockRestore());

  describe('GET /superset/district-drill', () => {
    it('rejects a missing district', async () => {
      const res = await request(app).get('/api/superset/district-drill');
      expect(res.status).toBe(400);
    });

    it('rejects a district name with unsafe characters', async () => {
      const res = await request(app).get('/api/superset/district-drill').query({ district: "x'; DROP TABLE y;--" });
      expect(res.status).toBe(400);
      expect(helper.runAnalyticsSql).not.toHaveBeenCalled();
    });

    it('returns block counts from the analytics SQL helper', async () => {
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      helper.runAnalyticsSql.mockResolvedValue([
        { block_name: 'Bodhan', lp_count: '339' },
        { block_name: 'Nandipet', lp_count: 333 },
      ]);

      const res = await request(app).get('/api/superset/district-drill').query({ district: 'Nizamabad' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        district: 'Nizamabad',
        blocks: [{ name: 'Bodhan', lpCount: 339 }, { name: 'Nandipet', lpCount: 333 }],
      });
      expect(helper.runAnalyticsSql.mock.calls[0][0]).toMatch(/d\.name = 'Nizamabad'/);
    });

    it('restricts the query to nothing for a user with no data scope', async () => {
      getPermission.mockReturnValue([{ scopeType: 'UNBOUND' }]);
      helper.runAnalyticsSql.mockResolvedValue([]);

      const res = await request(app).get('/api/superset/district-drill').query({ district: 'Nizamabad' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ district: 'Nizamabad', blocks: [] });
      expect(helper.runAnalyticsSql.mock.calls[0][0]).toMatch(/AND \(FALSE\)/);
    });

    it('returns 500 when the query fails', async () => {
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      helper.runAnalyticsSql.mockRejectedValue(new Error('Superset down'));

      const res = await request(app).get('/api/superset/district-drill').query({ district: 'Nizamabad' });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /superset/guest-token', () => {
    it('issues a token for both dashboards using the shared admin session', async () => {
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      axios.post.mockResolvedValue({ data: { token: 'guest-token-1' } });

      const res = await request(app).post('/api/superset/guest-token');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ token: 'guest-token-1', dashboardUuid: 'dash-desktop', mobileDashboardUuid: 'dash-mobile' });
      expect(axios.post.mock.calls[0][1].resources.map((r) => r.id)).toEqual(['dash-desktop', 'dash-mobile']);
    });

    it('logs in again and retries once when the admin session has expired', async () => {
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      axios.post
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockResolvedValueOnce({ data: { token: 'guest-token-2' } });

      const res = await request(app).post('/api/superset/guest-token');

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('guest-token-2');
      expect(helper.resetSupersetAuth).toHaveBeenCalledTimes(1);
      expect(helper.getSupersetAuth).toHaveBeenCalledTimes(2);
    });
  });
});
