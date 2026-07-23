// Shared lifecycle hooks for integration tests: spins up a real Mongo
// instance (mongodb-memory-server) once per test file, clears
// collections between tests, and tears the instance down at the end.
// Require this at the top of each *.integration.test.js file.

const { setupTestDB, clearTestDB, closeTestDB } = require("../setup/db.setup");

beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});
