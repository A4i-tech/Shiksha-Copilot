/**
 * Jest configuration for Shiksha Backend tests
 *
 * This configuration is optimized for testing Node.js Express applications
 * with MongoDB and external service integrations.
 */

module.exports = {
  // Use Node.js test environment
  testEnvironment: 'node',

  // Root directories for tests
  roots: ['<rootDir>'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Files to collect coverage from
  collectCoverageFrom: [
    '<rootDir>/**/*.js',
    '!<rootDir>/node_modules/**',
    '!<rootDir>/coverage/**',
    '!<rootDir>/__tests__/**',
    '!<rootDir>/config/**',
    '!<rootDir>/migrations/**',
    '!<rootDir>/public/**',
    '!<rootDir>/*.config.js',
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'lcov',
    'html',
    'json'
  ],

  // Coverage thresholds (fail if below these values)
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },

  // Setup files to run before tests
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/setup/jest.setup.js'
  ],

  // Test timeout (10 seconds for integration tests)
  testTimeout: 10000,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Verbose output
  verbose: true,

  // Detect open handles (useful for debugging)
  detectOpenHandles: true,

  // Force exit after tests complete
  forceExit: true,

  // Maximum number of workers (run tests in parallel)
  maxWorkers: '50%',

  // Module name mapper (for path aliases if needed)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@models/(.*)$': '<rootDir>/models/$1',
    '^@controllers/(.*)$': '<rootDir>/controllers/$1',
    '^@managers/(.*)$': '<rootDir>/managers/$1',
    '^@dao/(.*)$': '<rootDir>/dao/$1',
    '^@services/(.*)$': '<rootDir>/services/$1',
    '^@helpers/(.*)$': '<rootDir>/helper/$1',
    '^@middlewares/(.*)$': '<rootDir>/middlewares/$1',
    '^@validations/(.*)$': '<rootDir>/validations/$1',
  },

  // Transform files (if using Babel or TypeScript)
  transform: {},

  // Files to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/public/',
  ],

  // Watch plugins for better watch mode experience
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Global setup (if needed)
  // globalSetup: '<rootDir>/__tests__/setup/global.setup.js',

  // Global teardown (if needed)
  // globalTeardown: '<rootDir>/__tests__/setup/global.teardown.js',

  // Error on deprecated APIs
  errorOnDeprecated: true,

  // Notify on completion
  notify: false,

  // Bail after first test failure (optional, for faster feedback)
  // bail: 1,

  // Run tests serially (useful for integration tests with shared DB)
  // runInBand: true,
};
