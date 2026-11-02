jest.mock('axios');

const loginResponse = (token = 'access-1') => ({
  data: { access_token: token },
  headers: { 'set-cookie': ['session=abc; Path=/; HttpOnly'] },
});
const csrfResponse = () => ({ data: { result: 'csrf-1' }, headers: { 'set-cookie': ['csrf=xyz; Path=/'] } });
const dbListResponse = (name = 'Analytics DB', id = 7) => ({ data: { result: [{ id: 1, database_name: 'Other' }, { id, database_name: name }] } });
const sqlResponse = (rows) => ({ data: { data: rows } });

describe('superset helper', () => {
  let axios;
  let helper;

  beforeEach(() => {
    jest.resetModules();
    process.env.SUPERSET_URL = 'http://superset:8088';
    process.env.SUPERSET_ADMIN_USERNAME = 'admin';
    process.env.SUPERSET_ADMIN_PASSWORD = 'test-password';
    axios = require('axios');
    axios.post.mockReset();
    axios.get.mockReset();
    helper = require('../../../helper/superset.helper');
  });

  function mockHappyPath(rows) {
    axios.post.mockImplementation((url) => {
      if (url.endsWith('/security/login')) return Promise.resolve(loginResponse());
      if (url.endsWith('/sqllab/execute/')) return Promise.resolve(sqlResponse(rows));
      return Promise.reject(new Error(`unexpected POST ${url}`));
    });
    axios.get.mockImplementation((url) => {
      if (url.includes('/security/csrf_token/')) return Promise.resolve(csrfResponse());
      if (url.includes('/api/v1/database/')) return Promise.resolve(dbListResponse());
      return Promise.reject(new Error(`unexpected GET ${url}`));
    });
  }

  describe('isSupersetConfigured', () => {
    it('is true when URL, username and password are set', () => {
      expect(helper.isSupersetConfigured()).toBe(true);
    });

    it.each(['SUPERSET_URL', 'SUPERSET_ADMIN_USERNAME', 'SUPERSET_ADMIN_PASSWORD'])('is false when %s is missing', (name) => {
      delete process.env[name];
      expect(helper.isSupersetConfigured()).toBe(false);
    });
  });

  describe('runAnalyticsSql', () => {
    it('logs in, finds the Analytics DB and returns the rows', async () => {
      mockHappyPath([{ value: '2026-10-22T01:00:00+00:00' }]);

      const rows = await helper.runAnalyticsSql('SELECT 1');

      expect(rows).toEqual([{ value: '2026-10-22T01:00:00+00:00' }]);
      const sqlCall = axios.post.mock.calls.find(([url]) => url.endsWith('/sqllab/execute/'));
      expect(sqlCall[1]).toEqual({ database_id: 7, sql: 'SELECT 1', runAsync: false });
      expect(sqlCall[2].headers).toMatchObject({
        Authorization: 'Bearer access-1',
        'X-CSRFToken': 'csrf-1',
        Cookie: 'session=abc; csrf=xyz',
        Referer: 'http://superset:8088',
      });
    });

    it('returns an empty list when the response has no data', async () => {
      mockHappyPath(undefined);
      expect(await helper.runAnalyticsSql('SELECT 1')).toEqual([]);
    });

    it('reuses the admin session and the database id across calls', async () => {
      mockHappyPath([]);

      await helper.runAnalyticsSql('SELECT 1');
      await helper.runAnalyticsSql('SELECT 2');

      expect(axios.post.mock.calls.filter(([url]) => url.endsWith('/security/login'))).toHaveLength(1);
      expect(axios.get.mock.calls.filter(([url]) => url.includes('/api/v1/database/'))).toHaveLength(1);
      expect(axios.post.mock.calls.filter(([url]) => url.endsWith('/sqllab/execute/'))).toHaveLength(2);
    });

    it('logs in again and retries once when Superset answers 401', async () => {
      let sqlAttempts = 0;
      axios.post.mockImplementation((url) => {
        if (url.endsWith('/security/login')) return Promise.resolve(loginResponse(`access-${axios.post.mock.calls.length}`));
        if (url.endsWith('/sqllab/execute/')) {
          sqlAttempts += 1;
          if (sqlAttempts === 1) return Promise.reject({ response: { status: 401 } });
          return Promise.resolve(sqlResponse([{ value: 'ok' }]));
        }
        return Promise.reject(new Error(`unexpected POST ${url}`));
      });
      axios.get.mockImplementation((url) => (url.includes('/csrf_token/') ? Promise.resolve(csrfResponse()) : Promise.resolve(dbListResponse())));

      const rows = await helper.runAnalyticsSql('SELECT 1');

      expect(rows).toEqual([{ value: 'ok' }]);
      expect(sqlAttempts).toBe(2);
      expect(axios.post.mock.calls.filter(([url]) => url.endsWith('/security/login'))).toHaveLength(2);
    });

    it('does not retry on errors other than 401', async () => {
      axios.post.mockImplementation((url) => {
        if (url.endsWith('/security/login')) return Promise.resolve(loginResponse());
        return Promise.reject({ response: { status: 500 }, message: 'boom' });
      });
      axios.get.mockImplementation((url) => (url.includes('/csrf_token/') ? Promise.resolve(csrfResponse()) : Promise.resolve(dbListResponse())));

      await expect(helper.runAnalyticsSql('SELECT 1')).rejects.toMatchObject({ message: 'boom' });
      expect(axios.post.mock.calls.filter(([url]) => url.endsWith('/sqllab/execute/'))).toHaveLength(1);
    });

    it('fails clearly when the Analytics DB is not registered in Superset', async () => {
      mockHappyPath([]);
      axios.get.mockImplementation((url) => (url.includes('/csrf_token/') ? Promise.resolve(csrfResponse()) : Promise.resolve(dbListResponse('Something else'))));

      await expect(helper.runAnalyticsSql('SELECT 1')).rejects.toThrow('Analytics DB not found in Superset');
    });

    it('fails when the login returns no token', async () => {
      axios.post.mockResolvedValue({ data: {}, headers: {} });
      await expect(helper.runAnalyticsSql('SELECT 1')).rejects.toThrow('no token returned');
    });
  });

  describe('resetSupersetAuth', () => {
    it('forces a new login on the next call', async () => {
      mockHappyPath([]);
      await helper.getSupersetAuth();
      helper.resetSupersetAuth();
      await helper.getSupersetAuth();
      expect(axios.post.mock.calls.filter(([url]) => url.endsWith('/security/login'))).toHaveLength(2);
    });
  });
});
