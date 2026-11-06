jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => next(),
  requirePermission: () => (req, res, next) => next(),
}));
jest.mock('../../../controllers/master.lesson.controller.js', () =>
  class {
    constructor() {
      return new Proxy(this, {
        get: (target, prop) =>
          prop === 'getAll' ? (req, res) => res.json(req.query.filter) : jest.fn(),
      });
    }
  }
);

const express = require('express');
const request = require('supertest');

describe('master-lesson list route', () => {
  const app = express();
  app.use(require('../../../routes/master.lesson.routes.js'));

  it('forces the regenerated-lesson exclusion over a caller supplied isRegenerated filter', async () => {
    const res = await request(app).get('/master-lesson/list?filter[class]=5&filter[isRegenerated]=true');
    expect(res.body).toEqual({ $and: [{ class: '5', isRegenerated: 'true' }, { isRegenerated: { $ne: true } }] });
  });

  it('adds the exclusion when the caller sends no filter', async () => {
    const res = await request(app).get('/master-lesson/list');
    expect(res.body).toEqual({ isRegenerated: { $ne: true } });
  });
});
