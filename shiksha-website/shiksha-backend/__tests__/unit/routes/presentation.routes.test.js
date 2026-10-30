jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => {
    req.user = { _id: 'user-b' };
    req.permissions = [];
    next();
  },
}));
jest.mock('../../../helper/permission.helper.js', () => ({ hasPermission: jest.fn() }));
jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: () => (req, res) => res.status(200).send('proxied'),
}));

const http = require('http');
const express = require('express');
const request = require('supertest');

describe('presentation routes', () => {
  const app = express();
  app.use(require('../../../routes/presentation.routes.js'));

  it('blocks direct /presentation/events paths', async () => {
    const res = await request(app).get('/presentation/events/user-a/job-1');
    expect(res.status).toBe(404);
  });

  it('blocks encoded /presentation/events paths', async () => {
    expect((await request(app).get('/presentation/%65vents/user-a/job-1')).status).toBe(404);
    expect((await request(app).get('/presentation/events%2Fuser-a%2Fjob-1')).status).toBe(404);
  });

  it('still proxies other presentation paths', async () => {
    const res = await request(app).get('/presentation/download/job-1');
    expect(res.status).toBe(200);
  });

  describe('with the real proxy', () => {
    let stub;
    let seen;
    let realApp;
    const savedBase = process.env.LLM_API_BASE_URL;

    beforeAll(async () => {
      seen = [];
      stub = http.createServer((req, res) => {
        seen.push({ method: req.method, url: req.url, headers: req.headers });
        res.end('stub');
      });
      await new Promise((resolve) => stub.listen(0, '127.0.0.1', resolve));
      process.env.LLM_API_BASE_URL = `http://127.0.0.1:${stub.address().port}`;
      jest.isolateModules(() => {
        jest.unmock('http-proxy-middleware');
        realApp = express().use(require('../../../routes/presentation.routes.js'));
      });
    });

    afterAll(async () => {
      if (savedBase === undefined) delete process.env.LLM_API_BASE_URL;
      else process.env.LLM_API_BASE_URL = savedBase;
      await new Promise((resolve) => stub.close(resolve));
    });

    beforeEach(() => {
      seen.length = 0;
    });

    it('returns 403 for a POST without presentation.generate.arbitrary and sends nothing upstream', async () => {
      const res = await request(realApp).post('/presentation/jobs').send({});
      expect(res.status).toBe(403);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(seen).toHaveLength(0);
    });

    it('proxies a GET with the X-User-ID header', async () => {
      const res = await request(realApp).get('/presentation/download/job-1').set('X-User-ID', 'spoofed');
      expect(res.status).toBe(200);
      expect(seen).toHaveLength(1);
      expect(seen[0].url).toBe('/presentation/download/job-1');
      expect(seen[0].headers['x-user-id']).toBe('user-b');
    });
  });
});
