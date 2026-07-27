const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

const usingSharedMongo = () => Boolean(process.env.MONGO_URL);

/**
 * Setup test database connection.
 *
 * If MONGO_URL is set (E2E mode - see .github/workflows/ci-backend.yaml),
 * connects to that already-running MongoDB instance, the same one a live
 * app.js process is using. Otherwise spins up an ephemeral MongoDB Memory
 * Server for fast, isolated local/unit-style testing.
 */
const setupTestDB = async () => {
  try {
    await mongoose.disconnect();

    if (usingSharedMongo()) {
      await mongoose.connect(process.env.MONGO_URL);
    } else {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    }

    console.log("Test database connected successfully");
  } catch (error) {
    console.error("Test database connection error:", error);
    throw error;
  }
};

/**
 * Clear all collections in test database
 */
const clearTestDB = async () => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log("Test database cleared");
  } catch (error) {
    console.error("Error clearing test database:", error);
    throw error;
  }
};

/**
 * Close database connection and stop MongoDB Memory Server (if owned).
 */
const closeTestDB = async () => {
  try {
    // Remove all event listeners to prevent memory leaks
    mongoose.connection.removeAllListeners();

    if (!usingSharedMongo()) {
      // Only wipe the DB when we own an ephemeral instance - the shared
      // E2E Mongo is still in use by the live app.js process.
      await mongoose.connection.dropDatabase();
    }

    // Close connection
    await mongoose.connection.close();

    // Stop MongoDB Memory Server
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }

    console.log("Test database connection closed");
  } catch (error) {
    console.error("Error closing test database:", error);
    throw error;
  }
};

/**
 * Seed test database with initial data
 * @param {Object} data - Object containing arrays of documents for each model
 */
const seedTestDB = async (data) => {
  try {
    const models = Object.keys(data);

    for (const modelName of models) {
      const Model = mongoose.model(modelName);
      const documents = data[modelName];

      if (Array.isArray(documents) && documents.length > 0) {
        await Model.insertMany(documents);
        console.log(`Seeded ${documents.length} ${modelName} documents`);
      }
    }
  } catch (error) {
    console.error("Error seeding test database:", error);
    throw error;
  }
};

/**
 * Get a clean database for each test
 * Use in beforeEach() for test isolation
 */
const resetTestDB = async () => {
  await clearTestDB();
};

module.exports = {
  setupTestDB,
  clearTestDB,
  closeTestDB,
  seedTestDB,
  resetTestDB,
};
