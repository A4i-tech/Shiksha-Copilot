jest.mock('axios');
jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { _id: 'user-1', identity: { name: 'Test Leader' } };
    req.permissions = global.testPermissions || [];
    next();
  },
  requirePermission: () => (req, res, next) => next(),
  requireUnscopedPermission: () => (req, res, next) => {
    if (global.testBlockUnscoped) return res.status(403).json({ success: false, message: 'Access Denied!' });
    next();
  },
}));
jest.mock('../../../helper/dashboard.sync.js', () => ({ refreshBoards: jest.fn().mockResolvedValue() }));
jest.mock('../../../dao/dashboard.config.dao.js', () => class {
  findAllBoards() { return Promise.resolve(global.testBoards); }
});
jest.mock('../../../helper/permission.helper.js', () => ({ getPermission: jest.fn() }));
jest.mock('../../../helper/superset.helper.js', () => ({
  getSupersetAuth: jest.fn(),
  resetSupersetAuth: jest.fn(),
  runAnalyticsSql: jest.fn(),
}));
jest.mock('../../../models/audit.log.model.js', () => ({ create: jest.fn().mockResolvedValue({}) }));
jest.mock('../../../helper/dashboard.boards.js', () => {
  const actual = jest.requireActual('../../../helper/dashboard.boards.js');
  return {
    ...actual,
    saveBoard: jest.fn(),
  };
});

const express = require('express');
const request = require('supertest');

const charts = (...keys) => [{ permission: 'analytics.view' }, ...keys.map((key) => ({ permission: `analytics.chart.${key}` }))];

describe('superset routes', () => {
  let axios;
  let helper;
  let boardsHelper;
  let getPermission;
  let AuditLog;
  let app;
  let errorSpy;

  beforeEach(() => {
    jest.resetModules();
    delete global.testBlockUnscoped;
    process.env.SUPERSET_URL = 'http://superset:8088';
    process.env.SUPERSET_ADMIN_USERNAME = 'admin';
    process.env.SUPERSET_ADMIN_PASSWORD = 'test-password';
    global.testBoards = [
      { boardKey: 'full', chartKeys: ['a', 'b', 'c'], desktopUuid: 'full-d', mobileUuid: 'full-m' },
      { boardKey: 'field', chartKeys: ['a'], desktopUuid: 'field-d', mobileUuid: 'field-m' },
    ];
    global.testPermissions = charts('a', 'b', 'c');
    axios = require('axios');
    helper = require('../../../helper/superset.helper.js');
    boardsHelper = require('../../../helper/dashboard.boards.js');
    AuditLog = require('../../../models/audit.log.model.js');
    ({ getPermission } = require('../../../helper/permission.helper.js'));
    helper.getSupersetAuth.mockResolvedValue({ accessToken: 't', csrfToken: 'c', cookieHeader: 'k' });
    boardsHelper.saveBoard.mockResolvedValue({ boardKey: 'field', inserted: true, skippedRoles: [] });
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
    const resourceIds = () => axios.post.mock.calls[0][1].resources.map((r) => r.id);

    it('lists only the full board for a user who holds every chart, using the shared admin session', async () => {
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      axios.post.mockResolvedValue({ data: { token: 'guest-token-1' } });

      const res = await request(app).post('/api/superset/guest-token');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ token: 'guest-token-1', dashboardUuid: 'full-d', mobileDashboardUuid: 'full-m' });
      expect(resourceIds()).toEqual(['full-d', 'full-m']);
    });

    it('syncs the boards once more when none holds the charts, then uses the new board', async () => {
      const { refreshBoards } = require('../../../helper/dashboard.sync.js');
      global.testBoards = [];
      refreshBoards.mockImplementation(async (retryNow) => {
        if (retryNow) global.testBoards = [{ boardKey: 'full', chartKeys: ['a', 'b', 'c'], desktopUuid: 'full-d', mobileUuid: 'full-m' }];
      });
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      axios.post.mockResolvedValue({ data: { token: 'guest-token-1' } });

      const res = await request(app).post('/api/superset/guest-token');

      expect(res.status).toBe(200);
      expect(refreshBoards).toHaveBeenLastCalledWith(true);
      expect(resourceIds()).toEqual(['full-d', 'full-m']);
    });

    it('lists only the field board for a user who holds one chart', async () => {
      global.testPermissions = charts('a');
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);
      axios.post.mockResolvedValue({ data: { token: 'guest-token-1' } });

      const res = await request(app).post('/api/superset/guest-token');

      expect(res.status).toBe(200);
      expect(resourceIds()).toEqual(['field-d', 'field-m']);
    });

    it('returns 403 and asks Superset for no token when the user holds no chart', async () => {
      global.testPermissions = charts();
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);

      expect((await request(app).post('/api/superset/guest-token')).status).toBe(403);
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('returns 503 and asks Superset for no token when no board holds the charts', async () => {
      global.testPermissions = charts('b');
      getPermission.mockReturnValue([{ scopeType: 'GLOBAL' }]);

      expect((await request(app).post('/api/superset/guest-token')).status).toBe(503);
      expect(axios.post).not.toHaveBeenCalled();
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

  describe('PUT /superset/boards', () => {
    const validBoard = {
      boardKey: 'field',
      chartKeys: ['active_inactive_users'],
      desktopUuid: '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e',
      mobileUuid: '7a1d2c3b-4e5f-4a6b-9c8d-0e1f2a3b4c5d',
    };

    it('rejects a caller without unscoped role.manage with 403', async () => {
      global.testBlockUnscoped = true;
      const res = await request(app).put('/api/superset/boards').send(validBoard);
      expect(res.status).toBe(403);
      expect(res.body).toEqual({ success: false, message: 'Access Denied!' });
      expect(boardsHelper.saveBoard).not.toHaveBeenCalled();
    });

    it('rejects with 403 when user grants charts they do not hold and lacks role.delegate', async () => {
      global.testPermissions = [{ permission: 'analytics.view' }];
      getPermission.mockReturnValue(null);
      const res = await request(app).put('/api/superset/boards').send(validBoard);
      expect(res.status).toBe(403);
      expect(res.body.error).toContain('You cannot grant permissions you do not hold: analytics.chart.active_inactive_users');
      expect(boardsHelper.saveBoard).not.toHaveBeenCalled();
    });

    it('rejects with 422 when UUID is not an embedded dashboard (404 from Superset)', async () => {
      getPermission.mockReturnValue([{ permission: 'role.delegate' }]);
      axios.get.mockRejectedValueOnce({ response: { status: 404 } });

      const res = await request(app).put('/api/superset/boards').send(validBoard);
      expect(res.status).toBe(422);
      expect(res.body.error).toContain('is not an embedded Superset dashboard');
      expect(boardsHelper.saveBoard).not.toHaveBeenCalled();
    });

    it('rejects with 422 when dashboard slice names do not match chartKeys', async () => {
      getPermission.mockReturnValue([{ permission: 'role.delegate' }]);
      axios.get
        .mockResolvedValueOnce({ data: { result: { dashboard_id: 10 } } })
        .mockResolvedValueOnce({ data: { result: [{ slice_name: 'Mismatched Slice Name' }] } });

      const res = await request(app).put('/api/superset/boards').send(validBoard);
      expect(res.status).toBe(422);
      expect(res.body.error).toContain('The Superset dashboard does not match the board charts');
      expect(boardsHelper.saveBoard).not.toHaveBeenCalled();
    });

    it('saves board, writes audit log, and returns 200 on happy path', async () => {
      getPermission.mockReturnValue([{ permission: 'role.delegate' }]);
      axios.get
        .mockResolvedValueOnce({ data: { result: { dashboard_id: 10 } } })
        .mockResolvedValueOnce({ data: { result: [{ slice_name: 'Active / Inactive Users' }] } })
        .mockResolvedValueOnce({ data: { result: { dashboard_id: 11 } } })
        .mockResolvedValueOnce({ data: { result: [{ slice_name: 'Active / Inactive Users' }] } });

      const res = await request(app).put('/api/superset/boards').send(validBoard);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ boardKey: 'field', inserted: true, skippedRoles: [] });
      expect(boardsHelper.saveBoard).toHaveBeenCalledWith(expect.objectContaining({ boardKey: 'field' }));
      expect(AuditLog.create).toHaveBeenCalledWith(expect.objectContaining({
        eventType: 'Dashboard Board Save',
        status: 'success',
      }));
    });
  });
});
