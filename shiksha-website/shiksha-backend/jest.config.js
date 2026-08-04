module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.js"],
  testPathIgnorePatterns: ["/node_modules/", "/__tests__/integration/"],
  collectCoverageFrom: [
    "<rootDir>/**/*.js",
    "!<rootDir>/node_modules/**",
    "!<rootDir>/coverage/**",
    "!<rootDir>/__tests__/**",
    "!<rootDir>/jest.config.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "json-summary"],
  globalTeardown: "<rootDir>/__tests__/setup/globalTeardown.js",
  forceExit: true,
  detectOpenHandles: false,
  testTimeout: 30000,
};
