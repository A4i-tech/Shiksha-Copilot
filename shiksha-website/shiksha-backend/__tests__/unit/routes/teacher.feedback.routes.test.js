let mockAllowed = true;
const mockValidate = jest.fn((req, res, next) => next());
const mockCreate = jest.fn((req, res) => res.status(201).json({ success: true }));

jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => next(),
  requirePermission: (permission) => (req, res, next) =>
    mockAllowed && permission === 'lesson-resource.edit' ? next() : res.status(403).json({ success: false }),
}));
jest.mock('../../../validations/teacher.feedback.validation.js', () => ({
  validateTeacherResourceFeedback: (req, res, next) => mockValidate(req, res, next),
}));
jest.mock('../../../controllers/teacher.feedback.controller.js', () =>
  class {
    create(req, res) {
      return mockCreate(req, res);
    }
    getAll() {}
    getById() {}
    update() {}
  }
);

const express = require('express');
const request = require('supertest');

describe('teacher-resource-feedback create route', () => {
  const app = express();
  app.use(require('../../../routes/teacher.feedback.routes.js'));

  beforeEach(() => {
    mockAllowed = true;
    jest.clearAllMocks();
  });

  it('rejects a caller without lesson-resource.edit before the validator and controller run', async () => {
    mockAllowed = false;
    const res = await request(app).post('/teacher-resource-feedback/create');
    expect(res.status).toBe(403);
    expect(mockValidate).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('reaches the controller for a caller with lesson-resource.edit', async () => {
    const res = await request(app).post('/teacher-resource-feedback/create');
    expect(res.status).toBe(201);
    expect(mockValidate).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
  });
});
