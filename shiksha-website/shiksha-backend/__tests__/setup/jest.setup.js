// Global Jest setup file
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_SECRET_REMEMBER_ME = 'test-remember-me-secret';
process.env.PIN_SECRET_KEY = 'test-pin-secret';

// Increase Jest timeout for integration tests
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(), // Mock console.log
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(), // Keep error for debugging
};

// Mock external services
jest.mock('../../services/azure.blob.service');
jest.mock('../../services/chat.bot.service');
jest.mock('../../services/copilot.bot.service');
jest.mock('../../services/question.bank.bot.service');
jest.mock('../../services/variform.service');

// Global test utilities
global.expectSuccessResponse = (response) => {
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
};

global.expectErrorResponse = (response, statusCode = 400) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body).toHaveProperty('message');
};

global.expectValidationError = (response) => {
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body.message).toContain('validation');
};

global.expectAuthError = (response) => {
  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty('success', false);
};

global.expectForbiddenError = (response) => {
  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty('success', false);
};

global.expectNotFoundError = (response) => {
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty('success', false);
};

// Cleanup after all tests
afterAll(async () => {
  // Add any global cleanup here
  await new Promise(resolve => setTimeout(resolve, 500)); // Wait for async operations
});
