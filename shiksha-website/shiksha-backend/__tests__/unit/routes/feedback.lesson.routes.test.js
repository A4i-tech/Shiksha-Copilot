let mockAuthed = false;
let mockAllowed = true;
const mockValidate = jest.fn((req, res, next) => next());
const mockCreate = jest.fn((req, res) => res.status(201).json({ success: true }));

jest.mock('../../../middlewares/auth.js', () => ({
  isAuthenticated: (req, res, next) => (mockAuthed ? next() : res.status(401).json({ success: false })),
  requirePermission: (permission) => (req, res, next) =>
    mockAllowed && permission === 'lesson-plan.edit' ? next() : res.status(403).json({ success: false }),
}));
jest.mock('../../../validations/feedback.lesson.validation.js', () => ({
  validateFeedbackLesson: (req, res, next) => mockValidate(req, res, next),
}));
jest.mock('../../../controllers/feedback.lesson.controller.js', () =>
  class {
    create(req, res) {
      return mockCreate(req, res);
    }
    getAll() {}
    getByTeacher() {}
    getById() {}
    update() {}
  }
);

const express = require('express');
const request = require('supertest');

describe('lesson-feedback routes', () => {
  const app = express();
  app.use(require('../../../routes/feedback.lesson.routes.js'));

  beforeEach(() => {
    mockAuthed = false;
    mockAllowed = true;
    jest.clearAllMocks();
  });

  it('rejects an unauthenticated create before the validator runs', async () => {
    const res = await request(app).post('/lesson-feedback/create');
    expect(res.status).toBe(401);
    expect(mockValidate).not.toHaveBeenCalled();
  });

  it('rejects a caller without lesson-plan.edit before the validator and controller run', async () => {
    mockAuthed = true;
    mockAllowed = false;
    const res = await request(app).post('/lesson-feedback/create');
    expect(res.status).toBe(403);
    expect(mockValidate).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('reaches the controller for a caller with lesson-plan.edit', async () => {
    mockAuthed = true;
    const res = await request(app).post('/lesson-feedback/create');
    expect(res.status).toBe(201);
    expect(mockValidate).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalled();
  });
});
